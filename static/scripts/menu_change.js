const addNodeFormHTML = '<div id="addNodeForm">' +
JSON.parse(document.getElementById('addNodeFormHTML').textContent) +
'<button id="saveNodeButton" type="submit" onclick=saveNodeForm(this) form="addNodeForm">Принять</button>' +
'<a id="cancelNodeForm" onclick=cancelNodeForm(this) title="Отменить"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iI2RkNDY0NiIgZD0iTTE0OTAgMTMyMnEwIDQwLTI4IDY4bC0xMzYgMTM2cS0yOCAyOC02OCAyOHQtNjgtMjhsLTI5NC0yOTQtMjk0IDI5NHEtMjggMjgtNjggMjh0LTY4LTI4bC0xMzYtMTM2cS0yOC0yOC0yOC02OHQyOC02OGwyOTQtMjk0LTI5NC0yOTRxLTI4LTI4LTI4LTY4dDI4LTY4bDEzNi0xMzZxMjgtMjggNjgtMjh0NjggMjhsMjk0IDI5NCAyOTQtMjk0cTI4LTI4IDY4LTI4dDY4IDI4bDEzNiAxMzZxMjggMjggMjggNjh0LTI4IDY4bC0yOTQgMjk0IDI5NCAyOTRxMjggMjggMjggNjh6Ii8+Cjwvc3ZnPgo=" alt="X"></a>'
'</div>';

const nodeHTML = `
<ul class="tree-box">
  <input type="checkbox">
  <li class="tree-node">
    <label class="tree-label"><a></a></label><a onclick=delNode(this)></a>
  </li>
</ul>
`;

const tree = document.querySelector('.tree')

var nodeCounter = 1;

// поведение при клике на кнопку добавления пункта меню
function clickAddNodeButton(clickedButton) {
  let level = clickedButton.value;
  let parent = clickedButton.parentNode;
  clickedButton.remove();
  let newNode = addNodeForm(parent, level);
  newNode.querySelector('input').focus();
  toggleButtons(true);
};

// добавляет форму создания пункта меню
function addNodeForm(parent, level) {
  parent.innerHTML += addNodeFormHTML;
  parent.querySelector('#addNodeForm').value = level;

  // перехватывает нажатие Enter внутри формы создания пункта меню
  document.getElementById("addNodeForm").querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("saveNodeButton").click();
      }
    });
  });

  return parent.lastElementChild;
};

// удаляет форму создания пункта меню
function delNodeForm(form) {
  form.remove();
  toggleButtons();
};

// переключает атрибут disabled у всех кнопок кроме сохранения
function toggleButtons(disable=false) {
  document.querySelectorAll('.tree button').forEach(button => {
    if (button.id !== "saveNodeButton") {
      button.disabled = disable;
    };
  });
};

// отменяет форму создания пункта меню
function cancelNodeForm(clickedButton) {
  let form = clickedButton.parentNode;
  addAddNodeButton(form.parentNode, form.value);
  form = document.getElementById('addNodeForm');
  delNodeForm(form);
};

// поведение при клике на кнопку сохранения формы создания пункта меню
function saveNodeForm(clickedButton) {
  let form = clickedButton.parentNode;
  let level = parseInt(form.value);

  // проверяем поля и получаем чистые данные
  let requiredInputs = form.querySelectorAll('input[required]');
  let isRequiredFilled = true;
  requiredInputs.forEach(input => {
    if (!input.value) {
      isFormValid = false;
      togglePlaceholderError(input, 'обязательное поле...');
    } else {
      togglePlaceholderError(input);
    }
  });
  if (!isRequiredFilled) {
    return;
  };
  
  let xhr = ajaxCleanNodeForm(form);

  xhr.onerror = function() {
    console.log('Ошибка: ' + xhr.status);
    rejectForm(form);
    addAddNodeButton(parent, level);
  };

  xhr.onload = function() {
    let cleanData = JSON.parse(xhr.responseText);
    let parent = form.parentNode;
    if (cleanData.success === false) {
      console.log('Ошибка: ' + cleanData.errors.url)
      rejectForm(form, cleanData.errors.url);
      addAddNodeButton(parent, level);
    } else {
      let nodeTitle = cleanData.data.title;
      let nodeUrl = cleanData.data.url;
      delNodeForm(form)
      let newNode = addNode(parent, nodeTitle, nodeUrl, level);
      // newNode.querySelector('input').setAttribute('checked', true);
      addAddNodeButton(newNode, level + 1);
      addAddNodeButton(parent, level);
    };
  };
};

// отклонить форму и показать ошибку
function rejectForm(form, reason='Ошибка получения данных') {
  let parent = form.parentNode;
  form.remove();
  toggleErrorMessage(parent,reason);
  setTimeout(toggleErrorMessage, 1000, parent);
  toggleButtons();
};

// отмечает ошибку в поле
function togglePlaceholderError(input, message=null) {
  if (message) {
    input.classList.add('error');
    input.setAttribute('placeholder', message);
  } else {
    input.classList.remove('error')
  };
};

// отмечает ошибку текстом
function toggleErrorMessage(parent, message=null) {
  if (message) {
    let errorMessage = document.createElement('p');
    errorMessage.classList.add('error');
    errorMessage.innerText = message;
    parent.appendChild(errorMessage);
  } else {
    parent.querySelector('.error').remove();
  };
};

// обрабатывает форму пункта меню с помощью AJAX запроса
function ajaxCleanNodeForm(form) {
  let xhr = new XMLHttpRequest();
  let formData = new FormData();

  let formInputs = form.querySelectorAll('input');
  formInputs.forEach(input => {
    formData.append(input.name, input.value);
  });

  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  formData.append('csrfmiddlewaretoken', csrftoken);
  formData.append('domain', window.location.host);

  formData = new URLSearchParams(formData);

  xhr.open('POST', '/admin/tree_menu/menu/clean_node/');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('X-CSRFToken', csrftoken);
  xhr.send(formData);
  return xhr;
};

// добавляет пункт меню
function addNode(parent, nodeTitle, nodeUrl, level=0) {
  parent.innerHTML += nodeHTML;
  let newNode = parent.lastElementChild;
  newNode.querySelector('input').id = `treeNode${nodeCounter}`;
  newNode.querySelector('input').disabled = true;
  newNode.querySelector('.tree-label').setAttribute('for', `treeNode${nodeCounter}`);
  newNode.querySelector('.tree-node').setAttribute('data-level', level);
  nodeCounter += 1;
  let link = newNode.querySelector('a');
  link.textContent = nodeTitle;
  if (nodeUrl !== '') {
    link.href = nodeUrl;
  };
  return newNode;
};


// добавляет кнопку добавления нового пункта меню
function addAddNodeButton(parent, level=0) {
  let button = document.createElement('button');
  button.classList.add('add-node');
  button.value = level;
  button.type = 'button';
  button.setAttribute('onclick', 'clickAddNodeButton(this)');
  if (level > 0) {
    button.innerHTML = `<i class="bi bi-plus"></i> пункт ${level} уровня`;
  } else {
    button.innerHTML = `<i class="bi bi-plus"></i> корневой пункт`;
  };
  parent.appendChild(button);
  return button
};

// удаляет пункт меню со всеми подпунктами
function delNode(node) {
  node.closest('.tree-box').remove();
};

// создает дерево из JSON
function createTree(json, menuTitle) {
  let container = document.querySelector(`.tree[data-menu=${menuTitle}]`);
  
  // рекурсивный обход JSON
  function traverseJSON(parent, node, level=0) {
    let newNode = addNode(parent, node.title, node.url, level);
    if (node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        traverseJSON(newNode, node.children[i], level + 1);
      };
    };
  };

  let nodes = json.nodes;
  for (let i = 0; i < nodes.length; i++) {
    traverseJSON(container, nodes[i]);
  };
};

// генерирует JSON на основании дерева
/*
Пример структуры дерева HTML:
.tree
  .tree-box
    .tree-node
      .tree-label<a>TITLE 1 LEVEL 0
    .tree-box
      .tree-node
        .tree-label<a href="URL A">TITLE 1 LEVEL 1
    .tree-box
      .tree-node
        .tree-label<a>TITLE 2 LEVEL 1
  .tree-box
    .tree-node
      .tree-label<a href="URL B">TITLE 2 LEVEL 0

Результат её преобразования в JSON:
{
  "nodes": [
    {
    "title": "TITLE 1 LEVEL 0",
    "url": "",
    "children": [
      {
      "title": "TITLE 1 LEVEL 1",
      "url": "URL A",
      "children": []
      },
      
      {
      "title": "TITLE 2 LEVEL 1",
      "url": "",
      "children": []
      }
    ]},
    {
    "title": "TITLE 2 LEVEL 0",
    "url": "URL B",
    "children": []
    }
  ]
}
*/
function treeToJSON(tree) {
  let nodes = [];

  // рекурсивный обход дерева
  function traverseTree(box, array) {
    let node = {
      "title": "",
      "url": "",
      "children": []
    };
    node.title = box.querySelector('a').textContent.trim();
    node.url = box.querySelector('a').getAttribute('href') || "";
    
    if (box.querySelector('.tree-box')) {
      box.childNodes.forEach(child => {
        if (child.nodeType === 1 && child.classList.contains('tree-box')) {
          traverseTree(child, node.children);
        };
      });
    };
    
    array.push(node);
  };
  
  if (tree.children.length > 0) {
    tree.childNodes.forEach(child => {
      if (child.nodeType === 1 && child.classList.contains('tree-box')) {
        traverseTree(child, nodes);
      };
    });
  };

  return { "nodes": nodes };
};

// сохранение дерева
function saveTree(tree, input) {
  tree.querySelectorAll('button').forEach(button => {
    button.remove();
  });
  json = treeToJSON(tree);
  if (json) {
    input.value = JSON.stringify(json);
  };
};

// добавляет кнопки добавления пунктов меню
function addTreeNodeButtons(tree) {
  addAddNodeButton(tree, 0);
  tree.querySelectorAll('.tree-box').forEach(box => {
    let level = parseInt(box.querySelector('.tree-node').getAttribute('data-level'));
    addAddNodeButton(box, level + 1);
  });
}



// Инициализация
// перехват кнопки сохранения формы
document.querySelector('.submit-row').querySelectorAll('input[type=submit]').forEach(button => {
  button.addEventListener('click', event => {
    saveTree(document.querySelector('.tree'), document.getElementById('id_structure'));
  });
});

// создание дерева
createTree(JSON.parse(document.getElementById('id_structure').value), tree.getAttribute('data-menu'));
addTreeNodeButtons(document.querySelector('.tree'));
// document.querySelectorAll('.tree-box > input').forEach(input => {
//   input.checked = true;
// });