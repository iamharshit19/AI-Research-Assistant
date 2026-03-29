import requests
import xml.etree.ElementTree as ET

def fetch_arxiv_papers(query="machine learning", max_results=5):
    url = "http://export.arxiv.org/api/query"

    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }

    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        print("Error fetching data")
        return []

    root = ET.fromstring(response.content)

    papers = []
    
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text.strip()
        summary = entry.find("{http://www.w3.org/2005/Atom}summary").text.strip()
        link = entry.find("{http://www.w3.org/2005/Atom}id").text.strip()

        papers.append({
            "title": title,
            "summary": summary,
            "link": link
        })

    return papers


if __name__ == "__main__":
    papers = fetch_arxiv_papers("nlp", 5)

    for i, paper in enumerate(papers, 1):
        print(f"\n📄 Paper {i}")
        print(f"Title   : {paper['title']}")
        print(f"Summary : {paper['summary'][:300]}...")  # shorten
        print(f"Link    : {paper['link']}")
