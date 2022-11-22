function tabs(tabsSelector, tabContentSelector, tabParentSelector, activeClass) {
  const tabs = document.querySelectorAll(tabsSelector);
  const tabContent = document.querySelectorAll(tabContentSelector);
  const tabParent = document.querySelector(tabParentSelector);


  function hideTabContent() {
    tabContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove(activeClass);
    });
  }

  function showTabContent(i = 0) {
    tabs[i].classList.add(activeClass);
    tabContent[i].classList.add('show', 'fade');
    tabContent[i].classList.remove('hide');
  }

  hideTabContent();
  showTabContent();

  tabParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains(tabsSelector.slice(1))) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
}

export default tabs;