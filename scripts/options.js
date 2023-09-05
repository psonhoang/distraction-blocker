const textarea = document.getElementById('textInput');
const save = document.getElementById('save');
const checkbox = document.getElementById('checkbox');

const saveBlockedItems = () => {
  /* Saving updated list to local storage */
  const blacklist = document.getElementById('item-list');
  let blocked = Array.from(blacklist.getElementsByTagName('li'));
  blocked = blocked.map((item) => item.getAttribute('value'));
  chrome.storage.local.set({ blocked });
};

const deleteItem = (button) => {
  button.parentNode.remove();
  saveBlockedItems();
};

const addItem = (item = '') => {
  let blacklist = document.getElementById('item-list');
  let newItem = document.createElement('li');
  // Set the text content of the new <li> element
  newItem.textContent =
    item.length === 0
      ? textarea.value
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : item;
  // Adds value to li element
  newItem.setAttribute('value', newItem.textContent);
  // Create a new "Delete" button for the new <li> element
  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.onclick = function () {
    deleteItem(this);
  };
  // Append the "Delete" button to the new <li> element
  newItem.appendChild(deleteButton);
  // Append the new <li> element to the <ul> element
  blacklist.appendChild(newItem);
  // Save list if you're not loading list from local storage
  if (item.length === 0) {
    saveBlockedItems();
  }
};

save.addEventListener('click', () => {
  addItem();
  textarea.value = '';
});

checkbox.addEventListener('change', (event) => {
  const enabled = event.target.checked;
  chrome.storage.local.set({ enabled });
});

window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['blocked', 'enabled'], function (local) {
    const { blocked, enabled } = local;
    if (Array.isArray(blocked)) {
      blocked.forEach((item) => {
        addItem(item);
      });
      checkbox.checked = enabled;
    }
  });
});
