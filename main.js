class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.id = Math.random().toString(16).slice(2, 7);
  }
}

function parseInput(input) {
  const [listStr, posStr] = input.split("|").map(s => s.trim());
  const values = listStr.split(",").map(Number);
  const pos = posStr ? parseInt(posStr.split("=")[1]) : -1;
  return { values, pos };
}

function buildLinkedList(values, pos) {
  const nodes = values.map(v => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  if (pos !== -1 && nodes.length > 0) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return { head: nodes[0], nodes };
}

function detectCycle(head) {
  let slow = head, fast = head;
  const log = [];
  let step = 0;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    step++;
    log.push(`Step ${step}: slow at ${slow.val} (id: ${slow.id}), fast at ${fast?.val} (id: ${fast?.id})`);
    if (slow === fast) {
      log.push(`✅ Cycle detected at step ${step}, node value: ${slow.val}`);
      return { hasCycle: true, log };
    }
  }
  log.push("❌ No cycle detected.");
  return { hasCycle: false, log };
}

function drawSVG(nodes) {
  const svg = document.getElementById("visualization");
  svg.innerHTML = "";
  const spacing = 100;
  nodes.forEach((node, i) => {
    const x = 50 + i * spacing;
    svg.innerHTML += `<circle class="node" cx="${x}" cy="100" r="20"></circle>`;
    svg.innerHTML += `<text class="text" x="${x - 8}" y="105">${node.val}</text>`;
    if (node.next) {
      const j = nodes.indexOf(node.next);
      if (j !== -1) {
        const nx = 50 + j * spacing;
        svg.innerHTML += `<line x1="${x+20}" y1="100" x2="${nx-20}" y2="100" stroke="#000" marker-end="url(#arrow)"/>`;
      } else {
        svg.innerHTML += `<line x1="${x+20}" y1="100" x2="${x+60}" y2="60" stroke="red" stroke-dasharray="5,5"/>`;
      }
    }
  });
  svg.innerHTML += `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#000"/></marker></defs>`;
}

function run() {
  const input = document.getElementById("listInput").value;
  const { values, pos } = parseInput(input);
  const { head, nodes } = buildLinkedList(values, pos);
  drawSVG(nodes);
  const result = detectCycle(head);
  document.getElementById("logOutput").textContent = result.log.join("\\n");
}
