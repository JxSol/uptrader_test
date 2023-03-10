const nodeHTML = `
<ul class="tree-box">
  <input type="checkbox">
  <li class="tree-node">
    <label class="tree-label"><a></a></label>
  </li>
</ul>
`;

const currentURL = window.location.href
var nodeCounter = 1;

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

// добавляет пункт меню
function addNode(parent, nodeTitle, nodeUrl, level=0) {
  parent.innerHTML += nodeHTML;
  let newNode = parent.lastElementChild;
  newNode.querySelector('input').id = `treeNode${nodeCounter}`;
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

// открывает ветку содержащую ссылку
function openCurrentBranch(tree, url) {
  tree.querySelectorAll(`a[href="${url}"]`).forEach(leaf => {
    function traverseUp(node) {
      let box = node.closest('.tree-box');
      if (box) {
        box.querySelector('input').checked = true;
        traverseUp(box.parentNode);
      };
    };
    leaf.closest('.tree-box').classList.add('current');
    traverseUp(leaf);
  });
}

document.querySelectorAll('.tree').forEach(tree => {
  if (tree) {
    let menuTitle = tree.getAttribute('data-menu');
    let json = JSON.parse(document.getElementById(menuTitle).textContent);
    createTree(json, menuTitle);
    openCurrentBranch(tree, currentURL);
  };
});
