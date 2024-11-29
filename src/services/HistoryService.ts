import { SearchHistoryItem } from '../types/history';
import { LocalStorage } from '../utils/storage';

export class HistoryService {
    private static readonly STORAGE_KEY = 'search_history';
    private static readonly MAX_HISTORY_ITEMS = 50;

    static getHistory(): SearchHistoryItem[] {
        return LocalStorage.get<SearchHistoryItem[]>(this.STORAGE_KEY, []);
    }

    static addToHistory(
        searchTerm: string,
        dataset: string,
        humanReadable?: string
    ): void {
        const history = this.getHistory();

        const existingIndex = history.findIndex(
            item => item.searchTerm === searchTerm && item.dataset === dataset
        );

        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }

        const newItem: SearchHistoryItem = {
            searchTerm,
            dataset,
            timestamp: Date.now(),
            humanReadable
        };

        history.unshift(newItem);

        if (history.length > this.MAX_HISTORY_ITEMS) {
            history.pop();
        }

        LocalStorage.set(this.STORAGE_KEY, history);
    }

    static clearHistory(): void {
        LocalStorage.remove(this.STORAGE_KEY);
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
