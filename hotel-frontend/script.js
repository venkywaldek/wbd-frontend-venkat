//  const apiUrl = "https://battinav-webcommunications-project-battinav-webb1project.2.rahtiapp.fi/api/ip"

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

async function getGuests() {
  try {
    const res = await fetch(`${apiUrl}/guests`);
    const guests = await res.json();

    guestId.innerHTML = '<option value="">Välj en gäst</option>';

    for (const guest of guests) {
      const option = document.createElement("option");
      option.value = guest.id;
      option.textContent =
        `${guest.first_name} ${guest.last_name}` +
        (guest.previous_visits !== undefined
          ? ` (${guest.previous_visits} tidigare besök)`
          : "");
      guestId.appendChild(option);
    }
  } catch (error) {
    console.error("Fel vid hämtning av gäster:", error);
    guestId.innerHTML = '<option value="">Kunde inte ladda gäster</option>';
  }
}

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

    for (const b of bookings) {
      const li = document.createElement("li");

      li.textContent =
        `Bokning #${b.id} | ` +
        `Gäst: ${
          b.first_name && b.last_name
            ? `${b.first_name} ${b.last_name}`
            : b.guest_id
        } | ` +
        `Rum: ${b.room_number ?? b.room_id} | ` +
        `Från: ${b.datefrom} | Till: ${b.dateto}` +
        (b.nights !== undefined ? ` | Nätter: ${b.nights}` : "") +
        (b.total_price !== undefined ? ` | Totalpris: ${b.total_price} €` : "") +
        (b.addinfo ? ` | Info: ${b.addinfo}` : "");

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

    await getGuests();
    await getBookings();
  } catch (error) {
    console.error("Fel vid skapande av bokning:", error);
    message.textContent = "Något gick fel.";
  }
}

createBookingBtn.addEventListener("click", createBooking);

window.addEventListener("load", async () => {
  await getGuests();
  await getRooms();
  await getBookings();
});