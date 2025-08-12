// Form validation
document.getElementById("bloodForm").addEventListener("submit", function(e) {
  const age = document.getElementById("age").value;
  const phone = document.getElementById("phone").value;

  if (age < 18 || age > 65) {
    alert("Age must be between 18 and 65 to donate blood.");
    e.preventDefault();
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be 10 digits.");
    e.preventDefault();
  }
});

// Sample donor data (In real website, this comes from a database)
const donors = [
  { name: "Rohit Sharma", blood: "O+", city: "Mumbai" },
  { name: "Anjali Mehta", blood: "B+", city: "Pune" },
  { name: "Vikas Kumar", blood: "A-", city: "Delhi" },
  { name: "Priya Singh", blood: "O+", city: "Mumbai" }
];

// Search donors by blood group
function findDonors() {
  const searchValue = document.getElementById("searchBlood").value.toUpperCase();
  const list = document.getElementById("donorList");
  list.innerHTML = "";

  const filteredDonors = donors.filter(d => d.blood === searchValue);

  if (filteredDonors.length === 0) {
    list.innerHTML = "<li>No donors found for this blood group.</li>";
  } else {
    filteredDonors.forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.name} - ${d.blood} (${d.city})`;
      list.appendChild(li);
    });
  }
}
