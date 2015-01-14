describe('tests', function() {
  var username = "USERNAME";
  var linksnum = 0;

  var links = element.all(by.repeater('link in annotatedlinks'));

  browser.get('https://webmaker.org/user/' + username);

  it('Should have a title', function() {
    expect(browser.getTitle()).toEqual(username + ' | Webmaker');
  });

  it('Should display username', function() {
    expect(element(by.binding(' WMP.username ')).getText()).toEqual(username);
  });

  it('Should show correct number of links', function() {
    expect(links.count()).toEqual(linksnum);
  });

  it('Should not display edit button when not logged in', function() {
    expect(element(by.buttonText('Edit')).isPresent()).toBe(false);
  });

  it('Should show login buttton', function() {
    expect(element(by.buttonText('Log In')).isPresent()).toBe(true);
  });

  it('Should not display change avatar when not logged in', function() {
    expect(element(by.binding(' Gravatar | i18n ')).isPresent()).toBe(false);
  });

});
