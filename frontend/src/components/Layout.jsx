import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Research Paper', href: '/scholar' },
        { name: 'Dashboard', href: '/dashboard' },
    ];

    return (
        <div className="h-screen bg-background text-foreground flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-lg font-semibold tracking-tight">Research Assistant</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header (visible only on small screens) */}
                <div className="md:hidden border-b border-border p-4 bg-card flex justify-between items-center">
                    <span className="font-semibold">Research Assistant</span>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-muted">
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <div className="flex space-x-4 text-sm">
                            {navigation.map((item) => (
                                <Link key={item.name} to={item.href} className="text-muted-foreground">{item.name}</Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
