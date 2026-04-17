/* =========================================
   NEXUS EVENT DASHBOARD - SCRIPT
   Interactivity & Mock Data
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Data
    const events = [
        {
            id: 1,
            title: "Tech Innovators Summit 2026",
            date: { day: "24", month: "Apr" },
            location: "Grand Arena, San Francisco",
            attendees: "1.2k registered",
            status: "Active"
        },
        {
            id: 2,
            title: "Global Design Week",
            date: { day: "12", month: "May" },
            location: "Exhibition Center, London",
            attendees: "850 registered",
            status: "Upcoming"
        },
        {
            id: 3,
            title: "AI & Robotics Expo",
            date: { day: "05", month: "Jun" },
            location: "Tech Hub, Tokyo",
            attendees: "2.5k registered",
            status: "Upcoming"
        }
    ];

    const activities = [
        { name: "John Doe", event: "Tech Innovators", time: "2 mins ago" },
        { name: "Sarah Smith", event: "Tech Innovators", time: "5 mins ago" },
        { name: "Mike Johnson", event: "Tech Innovators", time: "12 mins ago" },
        { name: "Emily Brown", event: "Tech Innovators", time: "15 mins ago" }
    ];

    // 2. Elements
    const eventsList = document.getElementById('eventsList');
    const activityList = document.getElementById('activityList');
    const qrModal = document.getElementById('qrModal');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    const closeEventModal = document.getElementById('closeEventModal');
    const modalEventTitle = document.getElementById('modalEventTitle');
    const checkInBtn = document.getElementById('checkInBtn');
    const newEventBtn = document.getElementById('newEventBtn');
    const eventForm = document.getElementById('eventForm');
    const searchInput = document.getElementById('searchInput');

    // 3. Render Events
    function renderEvents(filterText = "") {
        const filteredEvents = events.filter(e => 
            e.title.toLowerCase().includes(filterText.toLowerCase()) ||
            e.location.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredEvents.length === 0) {
            eventsList.innerHTML = `<p class="no-results">No events found matching "${filterText}"</p>`;
            return;
        }

        eventsList.innerHTML = filteredEvents.map(event => `
            <div class="event-card glass">
                <div class="event-info-main">
                    <div class="event-date">
                        <p class="month">${event.date.month}</p>
                        <p class="day">${event.date.day}</p>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <span><span class="material-symbols-rounded">location_on</span> ${event.location}</span>
                            <span><span class="material-symbols-rounded">group</span> ${event.attendees}</span>
                        </div>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="secondary-btn" onclick="openEventPass('${event.title.replace(/'/g, "\\'")}')">
                        Event Pass
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 4. Render Activity
    function renderActivity() {
        activityList.innerHTML = activities.map(activity => `
            <li class="activity-item">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(activity.name)}&background=random&color=fff&rounded=true" alt="Avatar" class="avatar-sm">
                <div class="activity-details">
                    <p><strong>${activity.name}</strong> checked into <strong>${activity.event}</strong></p>
                    <span class="time-ago">${activity.time}</span>
                </div>
            </li>
        `).join('');
    }

    // 5. Modal Logic
    window.openEventPass = (title) => {
        modalEventTitle.innerText = title;
        qrModal.classList.add('active');
    };

    // New Event Modal
    newEventBtn.addEventListener('click', () => {
        eventModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });

    closeEventModal.addEventListener('click', () => {
        eventModal.classList.remove('active');
    });

    [qrModal, eventModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // 6. Handle New Event Form
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newEvent = {
            id: events.length + 1,
            title: document.getElementById('eventTitle').value,
            date: { 
                day: document.getElementById('eventDay').value, 
                month: document.getElementById('eventMonth').value 
            },
            location: document.getElementById('eventLoc').value,
            attendees: "0 registered",
            status: "Upcoming"
        };

        events.unshift(newEvent);
        renderEvents();
        eventForm.reset();
        eventModal.classList.remove('active');

        // Optional: Add activity for creating event
        activities.unshift({
            name: "You",
            event: "System",
            time: `Created ${newEvent.title}`
        });
        renderActivity();
    });

    // 7. Search Logic
    searchInput.addEventListener('input', (e) => {
        renderEvents(e.target.value);
    });

    // 8. Simulate Check-in
    checkInBtn.addEventListener('click', () => {
        const originalText = checkInBtn.innerText;
        checkInBtn.innerText = "Checking in...";
        checkInBtn.disabled = true;

        setTimeout(() => {
            checkInBtn.innerText = "Success!";
            checkInBtn.style.background = "var(--success)";
            
            // Add new activity
            activities.unshift({
                name: "You",
                event: modalEventTitle.innerText,
                time: "Just now"
            });
            renderActivity();

            setTimeout(() => {
                qrModal.classList.remove('active');
                // Reset button for next time
                setTimeout(() => {
                    checkInBtn.innerText = originalText;
                    checkInBtn.disabled = false;
                    checkInBtn.style.background = "";
                }, 400);
            }, 1000);
        }, 1500);
    });

    // Initial Render
    renderEvents();
    renderActivity();
});
