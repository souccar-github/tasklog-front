import { TaskLogTemplatePage } from './app.po';

describe('TaskLog App', function() {
  let page: TaskLogTemplatePage;

  beforeEach(() => {
    page = new TaskLogTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
