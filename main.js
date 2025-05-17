function simulate() {
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
}
