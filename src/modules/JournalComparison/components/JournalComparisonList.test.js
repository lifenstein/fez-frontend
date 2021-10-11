import * as mockData from 'mock/data/testing/journals/journalComparison';
import { JournalComparisonList } from './JournalComparisonList';
import { JournalsList } from '../../SharedComponents/JournalsList';
import { locale } from '../../../locale';

const setup = (testProps = {}) => {
    return getElement(JournalComparisonList, testProps);
};

describe('JournalComparisonList', () => {
    it('should render when there are no journals to compare', () => {
        const wrapper = setup();
        expect(wrapper.find(JournalsList).length).toBe(0);
        expect(wrapper.text()).toContain(locale.components.journalComparison.journalComparisonList.empty);
    });
    it('should render when there are journals to compare', async () => {
        const wrapper = setup({ journals: mockData.journals });
        expect(wrapper.find(JournalsList).length).toBe(1);
    });
});
