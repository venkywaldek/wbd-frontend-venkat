// const apiUrl = "https://battinav-webcommunications-project-battinav-webb1project.2.rahtiapp.fi/api/ip"
// const apiUrl = 'https://battinav-webcommunications-project-battinav-webb1project.2.rahtiapp.fi';



// TEMP flytta till LocalStorage eller liknande:
// const API_KEY = "dd00586df58693253967e2b28193707aa8a0e847cd2355194e66a4d16ba7ca4b"

// API base URL
const apiUrl = window.location.origin;

// Read API key from URL
const params = new URLSearchParams(window.location.search);
const API_KEY = params.get("api_key");

// Store logged-in guest
let currentGuest = null;

// Check API key
if (!API_KEY) {
    alert("API key missing in URL. Use ?api_key=Your_KEY");
}

// Hämta nuvarande gästs bokningar
async function getBookings() {
    const res = await fetch(`${apiUrl}/bookings`,{
        headers: {'X-API-Key': API_KEY}});
    const bookings = await res.json();
    console.log(bookings)
    document.getElementById("bookings-list").innerHTML = '';
    for (const b of bookings) {
        document.getElementById("bookings-list").innerHTML += `
            <li>
                ${b.id} - ${b.datefrom} - rum ${b.room_number} - ${b.first_name} ${b.last_name} - ${b.nights} nätter, totalt: ${b.total_price} €
                <select id="stars-${b.id}">
                    <option value="5" ${b.stars === 5 ? "selected" : ""} >⭐⭐⭐⭐⭐</option>
                    <option value="4" ${b.stars === 4 ? "selected" : ""} >⭐⭐⭐⭐</option>
                    <option value="3" ${b.stars === 3 ? "selected" : ""} >⭐⭐⭐</option>
                    <option value="2" ${b.stars === 2 ? "selected" : ""} >⭐⭐</option>
                    <option value="1" ${b.stars === 1 ? "selected" : ""} >⭐</option>
                </select>
                <button type="button" onClick="saveStars(${b.id})">Spara recension</button>
            </li> `;
    }
}


async function getRooms() {
    const res = await fetch(`${apiUrl}/rooms`, {
        headers: {'X-API-Key': API_KEY}
    });
    const rooms = await res.json();
    console.log(rooms)
     document.getElementById("room-list").innerHTML = `
     <option value=""> Välj rum </option>`

    for ( const room of rooms) {
        document.getElementById("room-list").innerHTML += `
            <option value="${room.id}">
                ${room.room_number} - 
                ${room.room_type} - 
                ${room.price} €
            </option>
        `;
    }
}


async function saveBooking() {
    const fromDate = new Date(document.getElementById("datefrom").value)
    const toDate = new Date(document.getElementById("dateto").value)
    if(toDate <= fromDate){
        document.getElementById("message").textContent = "Till-datum måste vara senare än från datum."
        return
    }
    const booking = {
        room_id: Number(document.getElementById("room-list").value),
        guest_id: currentGuest.id,
        datefrom: document.getElementById("datefrom").value,
        dateto: document.getElementById("dateto").value
    }
    
    const res = await fetch(`${apiUrl}/bookings`, { 
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY
        },
        body: JSON.stringify(booking)
    });
    const data = await res.json();

    console.log(data);
    if(res.ok){
        document.getElementById("message").textContent = "✅ Bokning skapad!";
    }else {
        document.getElementById("message").textContent =
            "❌ Kunde inte skapa bokning";
    }
  await  getBookings();
}

async function getCurrentGuest() {
    const res = await fetch(`${apiUrl}/current_guest`, {
        headers: { 'X-API-Key': API_KEY }
    });

    const guest = await res.json();
    console.log("Current guest:", guest);

    currentGuest = guest;

    document.getElementById("guest-list").textContent =
        `${guest.first_name} ${guest.last_name}`;
}

async function saveStars(bookingId){
  const stars = Number(document.getElementById(`stars-${bookingId}`).value);
  const res = await fetch(`${apiUrl}/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    },
    body: JSON.stringify({stars: stars})
  })
  const data = await res.json()
  console.log(data);

  await getBookings()
}
document.getElementById('btn-save').addEventListener('click', saveBooking);

window.addEventListener("load", async () => {
    if (!API_KEY) return;
    await getCurrentGuest();
    await getRooms();
    await getBookings();
});