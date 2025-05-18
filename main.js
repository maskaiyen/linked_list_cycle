let animationId = null;

function simulate() {
  clearSVG();

  const vals = document.getElementById('values').value.split(',').map(x => parseInt(x));
  const pos = parseInt(document.getElementById('pos').value);
  const nodes = vals.map(v => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i+1];
  if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];

  const svg = document.getElementById('visualization');
  const radius = 20;
  const spacing = 100;
  const y = 100;

  // draw nodes
  for (let i = 0; i < nodes.length; i++) {
    const x = i * spacing + 50;
    nodes[i].x = x;
    nodes[i].y = y;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("class", "node");
    svg.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14");
    text.textContent = nodes[i].val;
    svg.appendChild(text);
  }

  // draw arrows
  for (let i = 0; i < nodes.length; i++) {
    const from = nodes[i];
    const to = nodes[i].next;
    if (to) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", from.x + radius);
      line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x - radius);
      line.setAttribute("y2", to.y);
      svg.appendChild(line);
    }
  }

  // handle loop arrow
  if (pos >= 0 && pos < nodes.length) {
    const last = nodes[nodes.length - 1];
    const target = nodes[pos];
    const loop = document.createElementNS("http://www.w3.org/2000/svg", "path");
    loop.setAttribute("d", `M${last.x + 20},${last.y - 10} C ${last.x + 50},${last.y - 60}, ${target.x - 50},${target.y - 60}, ${target.x - 20},${target.y - 10}`);
    loop.setAttribute("fill", "none");
    loop.setAttribute("stroke", "#999");
    loop.setAttribute("stroke-width", "2");
    loop.setAttribute("marker-end", "url(#arrow)");
    svg.appendChild(loop);
  }

  // pointers
  const slowCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  const fastCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  slowCircle.setAttribute("r", 10);
  slowCircle.setAttribute("class", "slow");
  fastCircle.setAttribute("r", 10);
  fastCircle.setAttribute("class", "fast");
  svg.appendChild(slowCircle);
  svg.appendChild(fastCircle);

  let slow = nodes[0];
  let fast = nodes[0];
  const steps = [];
  let step = 0;

  function animate() {
    if (!fast || !fast.next) {
      steps.push("❌ No cycle detected.");
      document.getElementById("result").innerText = steps.join("\n");
      return;
    }

    slow = slow.next;
    fast = fast.next.next;
    step++;
    steps.push(`Step ${step}: slow at ${slow?.val}, fast at ${fast?.val}`);
    slowCircle.setAttribute("cx", slow.x);
    slowCircle.setAttribute("cy", slow.y - 30);
    fastCircle.setAttribute("cx", fast.x);
    fastCircle.setAttribute("cy", fast.y - 30);

    if (slow === fast) {
      steps.push(`✅ Cycle detected at node ${slow.val}`);
      document.getElementById("result").innerText = steps.join("\n");
      return;
    }

    document.getElementById("result").innerText = steps.join("\n");
    animationId = setTimeout(animate, 800);
  }

  animate();
}

function reset() {
  clearTimeout(animationId);
  document.getElementById("visualization").innerHTML = `
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5"
        orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L10,5 L0,10 Z" fill="#999" />
      </marker>
    </defs>`;
  document.getElementById("result").innerText = '';
}

function clearSVG() {
  const svg = document.getElementById('visualization');
  while (svg.lastChild && svg.childNodes.length > 1) {
    svg.removeChild(svg.lastChild);
  }
}
