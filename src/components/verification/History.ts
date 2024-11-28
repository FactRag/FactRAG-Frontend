export interface SearchHistoryItem {
    searchTerm: string;
    dataset: string;
    timestamp: number;
    humanReadable?: string;
}

export class SearchHistory {
    private static readonly STORAGE_KEY = 'search_history';
    private static readonly MAX_HISTORY_ITEMS = 50;

    static addToHistory(searchTerm: string, dataset: string, humanReadable?: string): void {
        const history = this.getHistory();

        const existingIndex = history.findIndex(
            item => item.searchTerm === searchTerm && item.dataset === dataset
        );

        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }

        history.unshift({
            searchTerm,
            dataset,
            timestamp: Date.now(),
            humanReadable
        });

        if (history.length > this.MAX_HISTORY_ITEMS) {
            history.pop();
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }

    static getHistory(): SearchHistoryItem[] {
        const historyString = localStorage.getItem(this.STORAGE_KEY);
        return historyString ? JSON.parse(historyString) : [];
    }

    static clearHistory(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    static formatDate(timestamp: number): string {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}