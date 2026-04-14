//  const apiUrl = "https://battinav-webcommunications-project-battinav-webb1project.2.rahtiapp.fi/api/ip"

const apiUrl = 'http://127.0.0.1:8080';


const guestId = document.getElementById("guest_id");
const datefrom = document.getElementById("datefrom");
const dateto = document.getElementById("dateto");
const addinfo = document.getElementById("addinfo");
const createBookingBtn = document.getElementById("createBookingBtn");
const roomSelect = document.getElementById("room_id");
const bookingList = document.getElementById("bookingList");
const roomList = document.getElementById("roomList");
const message = document.getElementById("message");

async function getRooms() {
  try {
    const res = await fetch(`${apiUrl}/rooms`);
    const rooms = await res.json();

    roomSelect.innerHTML = '<option value="">Välj ett rum</option>';
    roomList.innerHTML = "";

    for (const room of rooms) {
      const option = document.createElement("option");
      option.value = room.id;
      option.textContent = `Rum ${room.room_number} - ${room.room_type} - ${room.price} €`;
      roomSelect.appendChild(option);

      const li = document.createElement("li");
      li.textContent = `Rum ${room.room_number} - ${room.room_type} - ${room.price} €`;
      roomList.appendChild(li);
    }
  } catch (error) {
    console.error("Fel vid hämtning av rum:", error);
    roomSelect.innerHTML = '<option value="">Kunde inte ladda rum</option>';
  }
}

async function getBookings() {
  try {
    const res = await fetch(`${apiUrl}/bookings`);
    const bookings = await res.json();

    bookingList.innerHTML = "";

    for (const booking of bookings) {
      const li = document.createElement("li");

      li.textContent =
        `Bokning #${booking.id} | Rum: ${booking.room_number ?? booking.room_id} | ` +
        `Från: ${booking.datefrom} | Till: ${booking.dateto}` +
        (booking.addinfo ? ` | Info: ${booking.addinfo}` : "");

      bookingList.appendChild(li);
    }
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error);
    bookingList.innerHTML = "<li>Kunde inte ladda bokningar.</li>";
  }
}

async function createBooking() {
  const data = {
    guest_id: Number(guestId.value),
    room_id: Number(roomSelect.value),
    datefrom: datefrom.value,
    dateto: dateto.value,
    addinfo: addinfo.value
  };

  if (!data.guest_id || !data.room_id || !data.datefrom || !data.dateto) {
    message.textContent = "Fyll i alla obligatoriska fält.";
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(result);
      message.textContent = "Kunde inte skapa bokningen.";
      return;
    }

    message.textContent = "Bokningen skapades.";
    document.getElementById("bookingForm").reset();

    await getBookings();
  } catch (error) {
    console.error("Fel vid skapande av bokning:", error);
    message.textContent = "Något gick fel.";
  }
}

createBookingBtn.addEventListener("click", createBooking);

window.addEventListener("load", async () => {
  await getRooms();
  await getBookings();
});