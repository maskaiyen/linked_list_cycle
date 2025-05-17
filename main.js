function ListNode(val) {
  this.val = val;
  this.next = null;
}

function hasCycle(head) {
  let slow = head;
  let fast = head;
  let steps = [];

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    steps.push(`slow at ${slow.val}, fast at ${fast.val}`);
    if (slow === fast) {
      steps.push("Cycle detected!");
      return { result: true, steps };
    }
  }
  steps.push("No cycle found.");
  return { result: false, steps };
}

function runDemo() {
  const a = new ListNode(3);
  const b = new ListNode(2);
  const c = new ListNode(0);
  const d = new ListNode(-4);

  a.next = b;
  b.next = c;
  c.next = d;
  d.next = b; // cycle here!

  const { result, steps } = hasCycle(a);
  document.getElementById("output").textContent = steps.join("\n");
}
