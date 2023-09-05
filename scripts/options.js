const textInput = document.getElementById('textInput');
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

const addItem = async (item = '') => {
  if (item === '') {
    // Check if inputted site is already in list
    const { blocked } = await chrome.storage.local.get(['blocked']);
    if (Array.isArray(blocked)) {
      const matchedSite = blocked.find((domain) =>
        domain.includes(textInput.value.trim())
      );
      if (matchedSite) {
        // Exits if already there
        alert(`I think you have already blacklisted \"${matchedSite}\"`);
        return;
      }
    }
  }

  let blacklist = document.getElementById('item-list');
  let newItem = document.createElement('li');
  // Set the text content of the new <li> element
  newItem.textContent = item.length === 0 ? textInput.value.trim() : item;
  // Adds value to li element
  newItem.setAttribute('value', newItem.textContent);
  // Create a new "Delete" button for the new <li> element
  var deleteButton = document.createElement('button');
  deleteButton.innerHTML = '&#x2715';
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

const addItemHandler = async () => {
  await addItem();
  textInput.value = '';
};

save.addEventListener('click', async () => {
  await addItemHandler();
});

textInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await addItemHandler();
  }
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
