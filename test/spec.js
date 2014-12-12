describe('tests', function() {
  var username = "USERNAME";
  var linksnum = 0;

  var links = element.all(by.repeater('link in annotatedlinks'));

  beforeEach(function() {
    browser.get('https://webmaker.org/user/' + username);
  });

  it('Should have a title', function() {
    expect(browser.getTitle()).toEqual(username + ' | Webmaker');
  });

  it('Should display username', function() {
    expect(element(by.binding(' WMP.username ')).getText()).toEqual(username);
  });

  it('Should show correct number of links', function() {
    expect(links.count()).toEqual(linksnum);
  });
  
});
