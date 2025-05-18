function drawLinkedList(nodes) {
  const svg = document.getElementById("visualization");
  svg.innerHTML = ""; // 清除先前圖形

  const nodeRadius = 20;
  const spacing = 120;
  const offsetY = 75;

  nodes.forEach((node, i) => {
    const x = spacing * i + 50;

    // 畫節點圓形
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", offsetY);
    circle.setAttribute("r", nodeRadius);
    circle.setAttribute("fill", "#0d6efd");
    svg.appendChild(circle);

    // 畫文字
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", offsetY + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "14");
    text.textContent = node.val;
    svg.appendChild(text);

    // 畫箭頭（除最後一個或有 cycle 時處理）
    if (node.next) {
      const nextIndex = nodes.indexOf(node.next);
      const isCycle = nextIndex < i;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x + nodeRadius);
      line.setAttribute("y1", offsetY);
      line.setAttribute("x2", isCycle ? x + 40 : spacing * (i + 1) + 50 - nodeRadius);
      line.setAttribute("y2", offsetY);
      line.setAttribute("stroke", "black");
      line.setAttribute("marker-end", "url(#arrow)");
      svg.appendChild(line);

      // 若是 cycle，畫曲線
      if (isCycle) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${x + 40} ${offsetY} C ${x + 80} ${offsetY - 60}, ${spacing * nextIndex + 50 - 30} ${offsetY - 60}, ${spacing * nextIndex + 50 - 20} ${offsetY}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "red");
        path.setAttribute("stroke-dasharray", "4");
        svg.appendChild(path);
      }
    }
  });
}

function simulate() {
  console.log('simulate started'); // debug 用

  const vals = document.getElementById('values').value.split(',').map(x => parseInt(x));
  const pos = parseInt(document.getElementById('pos').value);
  const nodes = vals.map(v => ({ val: v, next: null }));

  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }

  if (pos >= 0) {
    nodes[nodes.length - 1].next = nodes[pos];
  }

  let slow = nodes[0], fast = nodes[0], steps = [], step = 0;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    step++;
    steps.push(`Step ${step}: slow at ${slow?.val}, fast at ${fast?.val}`);
    if (slow === fast) {
      steps.push(`✅ Cycle detected at node ${slow.val}`);
      break;
    }
  }

  if (!fast || !fast.next) {
    steps.push("❌ No cycle detected.");
  }

  document.getElementById("result").innerText = steps.join("\n");

  drawLinkedList(nodes);
}
