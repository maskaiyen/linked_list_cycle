let animationId = null;
let paused = false;
let isAutoRunning = false;
let slow, fast, nodes, steps, svg, radius, spacing, slowCircle, fastCircle, step;
let currentSpeed = 500;

function simulate() {
  reset();  // 重置狀態
  clearSVG();

  const vals = document.getElementById('values').value.split(',').map(x => parseInt(x));
  const pos = parseInt(document.getElementById('pos').value);
  nodes = vals.map(v => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];

  svg = document.getElementById('visualization');
  radius = 20;
  spacing = 100;
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

  // loop path
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

  // pointer circles
  slowCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  fastCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  slowCircle.setAttribute("r", 10);
  slowCircle.setAttribute("class", "slow");
  fastCircle.setAttribute("r", 10);
  fastCircle.setAttribute("class", "fast");
  svg.appendChild(slowCircle);
  svg.appendChild(fastCircle);

  slow = nodes[0];
  fast = nodes[0];
  step = 0;
  steps = [];
  isAutoRunning = true;
  currentSpeed = parseInt(document.getElementById('speed').value);

  animateStep();
}

function animateStep() {
  if (!fast || !fast.next) {
    steps.push("❌ No cycle detected.");
    updateResult();
    isAutoRunning = false;
    return;
  }

  slow = slow.next;
  fast = fast.next.next;
  step++;
  steps.push(`Step ${step}: slow at ${slow?.val}, fast at ${fast?.val}`);
  updatePointers();

  if (slow === fast) {
    steps.push(`✅ Cycle detected at node ${slow.val}`);
    updateResult();
    isAutoRunning = false;
    return;
  }

  updateResult();

  if (isAutoRunning && !paused) {
    animationId = setTimeout(animateStep, currentSpeed);
  }
}

function updatePointers() {
  slowCircle.setAttribute("cx", slow.x);
  slowCircle.setAttribute("cy", slow.y - 30);
  fastCircle.setAttribute("cx", fast.x);
  fastCircle.setAttribute("cy", fast.y - 30);
}

function updateResult() {
  document.getElementById("result").innerText = steps.join("\n");
}

function stepOnce() {
  if (!isAutoRunning) return;
  paused = true;
  animateStep();
}

function togglePause() {
  const btn = document.getElementById("pauseBtn");
  if (!isAutoRunning) return;

  paused = !paused;
  btn.innerText = paused ? "Resume" : "Pause";
  if (!paused) {
    currentSpeed = parseInt(document.getElementById('speed').value);
    animateStep();
  }
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
  paused = false;
  isAutoRunning = false;
  const btn = document.getElementById("pauseBtn");
  if (btn) btn.innerText = "Pause";
}

function clearSVG() {
  const svg = document.getElementById('visualization');
  while (svg.lastChild && svg.childNodes.length > 1) {
    svg.removeChild(svg.lastChild);
  }
}
