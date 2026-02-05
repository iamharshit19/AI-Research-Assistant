import faiss
from scholarly import scholarly
from services.llama_service import summarize_paper
from core.embeddings import embed_texts, embed_query
from core.vectorstore import save_index, load_index_and_meta


def fetch_google_scholar(topic, max_results=40, year_low=None, year_high=None):
    """
    Fetch papers from Google Scholar.
    
    Args:
        topic: Search query
        max_results: Maximum number of results (default 40)
        year_low: Minimum publication year (optional)
        year_high: Maximum publication year (optional)
    
    Returns:
        List of paper dictionaries
    """
    papers = []
    
    try:
        # Search for publications
        search_query = scholarly.search_pubs(topic)
        
        count = 0
        for result in search_query:
            if count >= max_results:
                break
            
            try:
                # Extract paper information
                title = result.get('bib', {}).get('title', 'No title')
                abstract = result.get('bib', {}).get('abstract', 'No abstract available')
                authors = result.get('bib', {}).get('author', [])
                year = result.get('bib', {}).get('pub_year', 'Unknown')
                citation_count = result.get('num_citations', 0)
                pub_url = result.get('pub_url', None)
                eprint_url = result.get('eprint_url', None)
                
                # Filter by year if specified
                if year_low and year != 'Unknown':
                    try:
                        if int(year) < year_low:
                            continue
                    except (ValueError, TypeError):
                        pass
                
                if year_high and year != 'Unknown':
                    try:
                        if int(year) > year_high:
                            continue
                    except (ValueError, TypeError):
                        pass
                
                # Format authors
                if isinstance(authors, list):
                    authors_str = ', '.join(authors[:3])  # First 3 authors
                    if len(authors) > 3:
                        authors_str += ' et al.'
                else:
                    authors_str = str(authors) if authors else 'Unknown'
                
                papers.append({
                    'title': title,
                    'abstract': abstract,
                    'authors': authors_str,
                    'year': str(year),
                    'citations': citation_count,
                    'pdf_url': eprint_url or pub_url,
                    'pub_url': pub_url,
                })
                
                count += 1
                
            except Exception as e:
                print(f"Error processing result: {e}")
                continue
        
    except Exception as e:
        print(f"Error searching Google Scholar: {e}")
        return []
    
    return papers


def scholar_search_and_summarize(topic, top_k=5, year_low=None, year_high=None, summarize=True):
    """
    Search Google Scholar, rank by relevance using embeddings, and optionally summarize.
    
    Args:
        topic: Search query
        top_k: Number of top results to return
        year_low: Minimum publication year
        year_high: Maximum publication year
        summarize: Whether to generate LLM summaries
    
    Returns:
        Dictionary with topic, papers, summaries, and aggregate summary
    """
    papers = fetch_google_scholar(topic, max_results=40, year_low=year_low, year_high=year_high)
    
    if not papers:
        return {
            'topic': topic,
            'papers': [],
            'summaries': [],
            'aggregate_summary': 'No papers found for this search.'
        }
    
    # Create text representations for embedding
    texts = [f"{p['title']} {p['abstract']}" for p in papers]
    
    # Generate embeddings
    embeddings = embed_texts(texts)
    
    # Build FAISS index
    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)
    
    # Query embedding
    q_emb = embed_query(topic)
    D, I = index.search(q_emb, min(top_k, len(papers)))
    
    results = []
    summaries = []
    
    for idx in I[0]:
        p = papers[idx]
        entry = p.copy()
        
        if summarize:
            try:
                summary = summarize_paper(p['title'], p['abstract'])
                entry['summary'] = summary
                summaries.append(summary)
            except Exception as e:
                print(f"Error generating summary: {e}")
                entry['summary'] = f"Summary generation failed: {str(e)}"
        
        results.append(entry)
    
    # Generate aggregate summary
    aggregate_summary = ""
    if summaries:
        try:
            aggregate_summary = generate_aggregate_summary(topic, summaries)
        except Exception as e:
            print(f"Error generating aggregate summary: {e}")
            aggregate_summary = "Aggregate summary generation failed."
    
    return {
        'topic': topic,
        'papers': results,
        'summaries': summaries,
        'aggregate_summary': aggregate_summary
    }


def generate_aggregate_summary(topic, summaries):
    """Generate an aggregate summary from multiple paper summaries."""
    joined = "\n\n".join(
        [f"Paper {i+1}:\n{summary}" for i, summary in enumerate(summaries)]
    )
    
    prompt_title = f"Aggregate summary for topic: {topic}"
    prompt_abstract = f"""
Below are summaries of the top papers on the topic "{topic}":

{joined}

Please analyze all summaries and produce a single consolidated literature overview with:
1. 5-line TLDR
2. Key contributions across all papers (4–6 bullet points)
3. Research gaps and future directions
4. Overall conclusion
"""
    
    return summarize_paper(prompt_title, prompt_abstract)
