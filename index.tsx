import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// Types
type Page = 'home' | 'gallery' | 'booking' | 'admin';
type ImageCategory = 'Hair' | 'Beard' | 'Other' | 'All';

interface Booking {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  email: string;
  service?: string; // Optional service
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: ImageCategory;
}

const ADMIN_EMAIL = 'andrej.lomen04@gmail.com';
const ADMIN_PASSWORD = '12345678';
const SHOP_OPEN_HOUR = 9;
const SHOP_CLOSE_HOUR = 18;
const LUNCH_BREAK_START_HOUR = 13;
const LUNCH_BREAK_END_HOUR = 14;
const SLOT_DURATION_MINUTES = 45;

// Helper Functions
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const generateTimeSlots = (date: Date): string[] => {
  const slots: string[] = [];
  const selectedDateStr = formatDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0,0,0,0);

  if (normalizedDate.getDay() === 0 || (normalizedDate.getTime() < today.getTime() && formatDate(normalizedDate) !== formatDate(today)) ) {
    return slots;
  }

  for (let hour = SHOP_OPEN_HOUR; hour < SHOP_CLOSE_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
      if (hour >= LUNCH_BREAK_START_HOUR && hour < LUNCH_BREAK_END_HOUR) {
        continue;
      }

      const slotDate = new Date(date);
      slotDate.setHours(hour, minute, 0, 0);

      if (slotDate.getHours() >= SHOP_CLOSE_HOUR && slotDate.getMinutes() > 0) continue;
      if (slotDate.getHours() > SHOP_CLOSE_HOUR) continue;
      if (slotDate.getHours() === SHOP_CLOSE_HOUR && minute > 0) continue;

      const now = new Date();
      if (selectedDateStr === formatDate(now) && slotDate.getTime() < now.getTime()) {
          continue;
      }

      const timeStr = formatTime(slotDate);
      slots.push(timeStr);
    }
  }
  return slots;
};

// Components
const Header: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void; onAdminAccess: () => void; isAdmin: boolean }> =
  ({ currentPage, onNavigate, onAdminAccess, isAdmin }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
      <header className="header">
        <div className="header-content">
          <a href="#" className="logo" onClick={(e) => {e.preventDefault(); onNavigate('home')}}>Bane's Fades</a>
          <button className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
            ☰
          </button>
          <nav className={`nav desktop-nav ${isMobileMenuOpen ? 'hidden' : ''}`}>
            <ul>
              <li><a href="#" className={currentPage === 'home' ? 'active' : ''} onClick={(e) => {e.preventDefault(); onNavigate('home')}}>Home</a></li>
              <li><a href="#" className={currentPage === 'gallery' ? 'active' : ''} onClick={(e) => {e.preventDefault(); onNavigate('gallery')}}>Gallery</a></li>
              <li><a href="#" className={currentPage === 'booking' ? 'active' : ''} onClick={(e) => {e.preventDefault(); onNavigate('booking')}}>Book Now</a></li>
              <li>
                <button
                  onClick={onAdminAccess}
                  className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
                  aria-current={currentPage === 'admin'}
                >
                  {isAdmin ? 'Admin Panel' : 'Admin Access'}
                </button>
              </li>
            </ul>
          </nav>
          {isMobileMenuOpen && (
            <nav className={`nav mobile-nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
              <ul>
                <li><a href="#" className={currentPage === 'home' ? 'active' : ''} onClick={(e) => {e.preventDefault(); onNavigate('home'); setIsMobileMenuOpen(false);}}>Home</a></li>
                <li><a href="#" className={currentPage === 'gallery' ? 'active' : ''} onClick={(e) => {e.preventDefault(); onNavigate('gallery'); setIsMobileMenuOpen(false);}}>Gallery</a></li>
                <li><a href="#" className={currentPage === 'booking' ? 'active' : ''} onClick={(e) => {e.preventDefault(); onNavigate('booking'); setIsMobileMenuOpen(false);}}>Book Now</a></li>
                <li>
                  <button
                    onClick={() => { onAdminAccess(); setIsMobileMenuOpen(false); }}
                    className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
                    aria-current={currentPage === 'admin'}
                  >
                    {isAdmin ? 'Admin Panel' : 'Admin Access'}
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
    );
};

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-socials">
        <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
        <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
        <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.422.724-.665 1.56-.665 2.452 0 1.606.816 3.022 2.054 3.849-.76-.024-1.474-.234-2.1-.583v.06c0 2.245 1.59 4.123 3.736 4.568-.39.106-.803.164-1.227.164-.3 0-.59-.028-.875-.082.593 1.843 2.312 3.186 4.352 3.225-1.582 1.238-3.575 1.975-5.752 1.975-.375 0-.743-.022-1.107-.065 2.042 1.318 4.473 2.088 7.08 2.088 8.492 0 13.138-7.037 13.138-13.138 0-.201 0-.402-.013-.602.902-.652 1.684-1.463 2.305-2.393z"/></svg></a>
    </div>
    <p>&copy; {new Date().getFullYear()} Bane's Fades. All Rights Reserved.</p>
    <p>123 Barber Street, Cityville | (555) 123-4567</p>
  </footer>
);

const HomePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
  <div className="home-page">
    <section className="hero">
      <h1>Welcome to Bane's Fades</h1>
      <p>Experience the art of barbering. Precision cuts, classic shaves, and modern styles, all in a relaxed atmosphere.</p>
      <button onClick={() => onNavigate('booking')}>Book Your Appointment</button>
    </section>
  </div>
);

const Lightbox: React.FC<{ image: GalleryImage | null; onClose: () => void }> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image Lightbox">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close-button" onClick={onClose} aria-label="Close lightbox">&times;</button>
        <img src={image.src} alt={image.alt} className="lightbox-image" />
        <p className="lightbox-caption">{image.alt} - Category: {image.category}</p>
      </div>
    </div>
  );
};

const GalleryPage: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  const [activeFilter, setActiveFilter] = useState<ImageCategory>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories: ImageCategory[] = ['All', 'Hair', 'Beard', 'Other'];

  const filteredImages = activeFilter === 'All' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <h2 className="page-title">Gallery</h2>
      <div className="gallery-filters">
        {categories.map(category => (
          <button 
            key={category} 
            onClick={() => setActiveFilter(category)}
            className={`filter-button ${activeFilter === category ? 'active' : ''}`}
            aria-pressed={activeFilter === category}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredImages.length === 0 && (
         <p className="empty-gallery-message">
           {activeFilter === 'All' ? "No images in the gallery yet. The admin can add some!" : `No images found for the "${activeFilter}" category.`}
         </p>
      )}
      <div className="gallery-grid">
        {filteredImages.map(img => (
          <div key={img.id} className="gallery-item" onClick={() => handleImageClick(img)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleImageClick(img)}>
            <img src={img.src} alt={img.alt} loading="lazy" />
            <div className="gallery-item-caption">{img.category}</div>
          </div>
        ))}
      </div>
      {lightboxOpen && <Lightbox image={selectedImage} onClose={closeLightbox} />}
    </div>
  );
};

const Calendar: React.FC<{
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const today = new Date();
  today.setHours(0,0,0,0); 

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); 

  const renderDays = () => {
    const days = [];
    const numDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    let firstDayIndex = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(name => days.push(<div key={name} className="day-name">{name}</div>));
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-prev-${i}`} className="day-cell empty"></div>);
    }

    for (let day = 1; day <= numDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0,0,0,0); 

      const isSelected = formatDate(date) === formatDate(selectedDate);
      const isPastDate = date.getTime() < today.getTime();
      const isSunday = date.getDay() === 0; 
      const isDisabled = isPastDate || isSunday;
      const isToday = formatDate(date) === formatDate(today);

      let className = "day-cell";
      if (isSelected && !isDisabled) className += " selected";
      if (isDisabled) className += " disabled";
      if (isSunday) className += " sunday-disabled";
      if (isToday && !isSelected && !isDisabled) className += " today";
      
      days.push(
        <button 
          key={day} 
          className={className} 
          onClick={() => !isDisabled && onDateSelect(date)}
          disabled={isDisabled}
          aria-label={isDisabled ? `Date ${date.toLocaleDateString()} unavailable` : `Select date ${date.toLocaleDateString()}`}
          aria-disabled={isDisabled}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const prevMonth = () => {
      const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (newMonth < minMonth && !(newMonth.getFullYear() === minMonth.getFullYear() && newMonth.getMonth() === minMonth.getMonth())) {
          return; 
      }
      setCurrentMonth(newMonth);
  };
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  
  const isPrevMonthDisabled = () => {
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return prevMonthDate.getFullYear() < minMonth.getFullYear() || 
           (prevMonthDate.getFullYear() === minMonth.getFullYear() && prevMonthDate.getMonth() < minMonth.getMonth());
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} disabled={isPrevMonthDisabled()} aria-label="Previous month">&lt; Prev</button>
        <h3>{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</h3>
        <button onClick={nextMonth} aria-label="Next month">Next &gt;</button>
      </div>
      <div className="calendar-grid">{renderDays()}</div>
    </div>
  );
};

const TimeSlotPicker: React.FC<{
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookings: Booking[];
  bookingIdToExclude?: string; // For edit mode
}> = ({ selectedDate, selectedTime, onTimeSelect, bookings, bookingIdToExclude }) => {
  const timeSlots = generateTimeSlots(selectedDate);
  const normalizedSelectedDate = new Date(selectedDate);
  normalizedSelectedDate.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(0,0,0,0);

  if (normalizedSelectedDate.getTime() < today.getTime() && formatDate(normalizedSelectedDate) !== formatDate(today)) {
      return <p className="time-slots-message">Please select a current or future date to see available slots.</p>;
  }
  if (selectedDate.getDay() === 0) { 
    return <p className="time-slots-message">We are closed on Sundays. Please select another day.</p>;
  }

  return (
    <div className="time-slots-container">
      <h4>Available Slots for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
      {timeSlots.length === 0 ? (
        <p className="time-slots-message">No slots available for this date. This could be due to it being fully booked, a past date, or outside business hours.</p>
      ) : (
        <div className="time-slots-grid">
          {timeSlots.map(slot => {
            const isBooked = bookings.some(
              booking => booking.date === formatDate(selectedDate) && booking.time === slot && booking.id !== bookingIdToExclude
            );
            return (
              <button
                key={slot}
                className={`time-slot-button ${selectedTime === slot ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                onClick={() => onTimeSelect(slot)}
                disabled={isBooked}
                aria-pressed={selectedTime === slot}
                aria-disabled={isBooked}
              >
                {slot}{isBooked ? " (Booked)" : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BookingForm: React.FC<{
  selectedDate: Date;
  selectedTime: string;
  onBookingConfirm: (name: string, email: string) => void;
}> = ({ selectedDate, selectedTime, onBookingConfirm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please fill in both name and email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    onBookingConfirm(name, email);
    setName('');
    setEmail('');
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h4>Confirm Your Booking</h4>
      <p>Date: {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>Time: {selectedTime}</p>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required aria-required="true" />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required aria-required="true" />
      </div>
      <button type="submit">Confirm Booking</button>
    </form>
  );
};

const BookingPage: React.FC<{
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}> = ({ bookings, addBooking }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    let initialDate = new Date();
    initialDate.setHours(0,0,0,0);
    if (initialDate.getDay() === 0) {
        initialDate.setDate(initialDate.getDate() + 1);
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    if (initialDate < today) {
        initialDate = today;
        if (initialDate.getDay() === 0) {
             initialDate.setDate(initialDate.getDate() + 1);
        }
    }
    return initialDate;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  useEffect(() => { 
    setSelectedTime(null);
    setBookingMessage(null);
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0,0,0,0);
    setSelectedDate(normalizedDate);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingMessage(null);
  };

  const handleBookingConfirm = (name: string, email: string) => {
    if (!selectedTime) return; 
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      date: formatDate(selectedDate),
      time: selectedTime,
      name,
      email,
    };
    addBooking(newBooking);
    setBookingMessage(`Booking confirmed for ${name} on ${formatDate(selectedDate)} at ${selectedTime}! A confirmation email would be sent to ${email} (simulated).`);
    setSelectedTime(null); 
  };
  
  const todayForPicker = new Date();
  todayForPicker.setHours(0,0,0,0);

  return (
    <div className="booking-page-container">
      <h2 className="page-title">Book Your Appointment</h2>
      {bookingMessage && <div className="message success" role="alert">{bookingMessage}</div>}
      <div className="booking-page-layout">
        <div className="calendar-container">
          <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
        </div>
        <div className="booking-details-container">
          { selectedDate.getDay() !== 0 && selectedDate >= todayForPicker && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              bookings={bookings}
            />
          )}
          {selectedTime && (
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onBookingConfirm={handleBookingConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Panel Sub-Components
const AdminSidebar: React.FC<{
    activeView: 'dashboard' | 'bookings' | 'gallery';
    onSetView: (view: 'dashboard' | 'bookings' | 'gallery') => void;
    onGoBack: () => void;
}> = ({ activeView, onSetView, onGoBack }) => (
    <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
            <h3>Bane's Admin</h3>
            <button onClick={onGoBack} className="admin-button-secondary" style={{marginTop: '10px', width: '100%'}}>
                Go Back to Site
            </button>
        </div>
        <nav className="admin-sidebar-nav">
            <ul>
                <li>
                    <button
                        onClick={() => onSetView('dashboard')}
                        className={`admin-sidebar-button ${activeView === 'dashboard' ? 'active' : ''}`}
                        aria-current={activeView === 'dashboard'}
                    >
                        <span role="img" aria-hidden="true">📊</span> Dashboard
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onSetView('bookings')}
                        className={`admin-sidebar-button ${activeView === 'bookings' ? 'active' : ''}`}
                        aria-current={activeView === 'bookings'}
                    >
                        <span role="img" aria-hidden="true">📅</span> Bookings
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onSetView('gallery')}
                        className={`admin-sidebar-button ${activeView === 'gallery' ? 'active' : ''}`}
                        aria-current={activeView === 'gallery'}
                    >
                        <span role="img" aria-hidden="true">🖼️</span> Gallery
                    </button>
                </li>
            </ul>
        </nav>
    </aside>
);

const AdminDashboardView: React.FC<{
    totalBookings: number;
    totalGalleryImages: number;
}> = ({ totalBookings, totalGalleryImages }) => (
    <section className="admin-view-content admin-dashboard-view">
        <h3 className="admin-view-header">Dashboard Overview</h3>
        <div className="admin-dashboard-stats">
            <div className="admin-stat-card">
                <h4>Total Bookings</h4>
                <p className="admin-stat-number">{totalBookings}</p>
            </div>
            <div className="admin-stat-card">
                <h4>Gallery Images</h4>
                <p className="admin-stat-number">{totalGalleryImages}</p>
            </div>
        </div>
    </section>
);

const AdminBookingsView: React.FC<{
    bookings: Booking[];
    sortOrder: 'asc' | 'desc';
    onSetSortOrder: (order: 'asc' | 'desc') => void;
    onDeleteBooking: (id: string) => void;
    onEditBooking: (booking: Booking) => void;
}> = ({ bookings, sortOrder, onSetSortOrder, onDeleteBooking, onEditBooking }) => (
    <section className="admin-view-content admin-bookings-view">
        <h3 className="admin-view-header">Manage Bookings</h3>
        <div className="admin-bookings-controls">
            <label htmlFor="bookingSort" className="admin-label">Sort by Date: </label>
            <select
                id="book
ingSort"
                value={sortOrder}
                onChange={(e) => onSetSortOrder(e.target.value as 'asc' | 'desc')}
                className="admin-select"
            >
                <option value="asc">Soonest First</option>
                <option value="desc">Latest First</option>
            </select>
        </div>
        {bookings.length === 0 ? <p className="admin-empty-message">No bookings yet.</p> : (
            <div className="admin-bookings-list">
                {bookings.map(booking => (
                    <div key={booking.id} className="admin-booking-card">
                        <div className="admin-booking-card-header">
                            <h4>{booking.name}</h4>
                        </div>
                        <div className="admin-booking-card-body">
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Email:</strong> {booking.email}</p>
                        </div>
                        <div className="admin-booking-card-actions">
                            <button className="admin-button-edit" onClick={() => onEditBooking(booking)}>
                                <span role="img" aria-hidden="true">✏️</span> Edit
                            </button>
                            <button className="admin-button-delete" onClick={() => { if (confirm('Are you sure you want to delete this booking?')) onDeleteBooking(booking.id); }}>
                                <span role="img" aria-hidden="true">🗑️</span> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </section>
);

const AdminGalleryView: React.FC<{
    galleryImages: GalleryImage[];
    onAddImage: (src: string, alt: string, category: ImageCategory) => void;
    onDeleteImage: (id: string) => void;
}> = ({ galleryImages, onAddImage, onDeleteImage }) => {
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageAlt, setNewImageAlt] = useState('');
    const [newImageCategory, setNewImageCategory] = useState<ImageCategory>('Hair');

    const handleAddImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newImageUrl.trim() && newImageAlt.trim()) {
            try {
                new URL(newImageUrl);
                onAddImage(newImageUrl, newImageAlt, newImageCategory);
                setNewImageUrl('');
                setNewImageAlt('');
                setNewImageCategory('Hair');
            } catch (_) {
                alert("Please enter a valid image URL.");
            }
        } else {
            alert("Please provide image URL, description, and category.");
        }
    };

    return (
        <section className="admin-view-content admin-gallery-view">
            <h3 className="admin-view-header">Manage Gallery</h3>
            <div className="admin-gallery-form-container">
                <h4>Add New Image</h4>
                <form onSubmit={handleAddImageSubmit} className="admin-add-image-form">
                    <div className="admin-form-group">
                        <label htmlFor="newImageUrlAdmin" className="admin-label">Image URL:</label>
                        <input id="newImageUrlAdmin" type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" required className="admin-input" />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="newImageAltAdmin" className="admin-label">Image Description (Alt Text):</label>
                        <input id="newImageAltAdmin" type="text" value={newImageAlt} onChange={e => setNewImageAlt(e.target.value)} placeholder="e.g., Modern Hairstyle" required className="admin-input" />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="newImageCategoryAdmin" className="admin-label">Category:</label>
                        <select id="newImageCategoryAdmin" value={newImageCategory} onChange={e => setNewImageCategory(e.target.value as ImageCategory)} required className="admin-select">
                            <option value="Hair">Hair</option>
                            <option value="Beard">Beard</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="admin-button-primary">Add Image to Gallery</button>
                </form>
            </div>

            <h4 className="admin-subsection-header">Current Gallery Images</h4>
            {galleryImages.length === 0 ? <p className="admin-empty-message">No images in the gallery.</p> : (
                <div className="admin-gallery-grid">
                    {galleryImages.map(image => (
                        <div key={image.id} className="admin-gallery-item-card">
                            <img src={image.src} alt={image.alt} className="admin-gallery-thumbnail" />
                            <div className="admin-gallery-item-info">
                                <p className="admin-gallery-item-alt">{image.alt}</p>
                                <p className="admin-gallery-item-category">Category: {image.category}</p>
                            </div>
                            <button className="admin-button-delete full-width" onClick={() => { if (confirm('Are you sure you want to delete this image?')) onDeleteImage(image.id); }}>
                                <span role="img" aria-hidden="true">🗑️</span> Delete Image
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <p className="admin-note">Note: Gallery images are stored locally in your browser.</p>
        </section>
    );
};

interface EditBookingModalProps {
    booking: Booking | null;
    allBookings: Booking[];
    onClose: () => void;
    onSave: (updatedBooking: Booking) => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, allBookings, onClose, onSave }) => {
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedDateStr, setEditedDateStr] = useState('');
    const [editedTime, setEditedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [modalError, setModalError] = useState<string | null>(null);

    useEffect(() => {
        if (booking) {
            setEditedName(booking.name);
            setEditedEmail(booking.email);
            setEditedDateStr(booking.date);
            setEditedTime(booking.time);
            setModalError(null);
        }
    }, [booking]);

    useEffect(() => {
        if (editedDateStr && booking) {
            const newSelectedDate = new Date(editedDateStr + 'T00:00:00'); // Ensure date is parsed correctly
            if (isNaN(newSelectedDate.getTime())) {
                 setAvailableTimes([]); return;
            }

            const potentialSlots = generateTimeSlots(newSelectedDate);
            const freeSlots = potentialSlots.filter(slot => {
                const isBookedByOther = allBookings.some(b =>
                    b.id !== booking.id &&
                    b.date === editedDateStr &&
                    b.time === slot
                );
                return !isBookedByOther;
            });
            setAvailableTimes(freeSlots);
            // If current time is not in new available slots, try to keep it if valid, or reset
            if (!freeSlots.includes(editedTime) && booking.date === editedDateStr) {
                 // Keep original time if date hasn't changed and it's valid
            } else if (!freeSlots.includes(editedTime)) {
                 setEditedTime(freeSlots.length > 0 ? freeSlots[0] : '');
            }

        }
    }, [editedDateStr, allBookings, booking, editedTime]);


    const handleSave = () => {
        setModalError(null);
        if (!booking) return;
        if (!editedName.trim() || !editedEmail.trim()) {
            setModalError("Name and Email cannot be empty.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(editedEmail)) {
            setModalError("Invalid email format.");
            return;
        }
        if (!editedDateStr || !editedTime) {
            setModalError("Date and Time must be selected.");
            return;
        }

        const selectedDateObj = new Date(editedDateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDateObj.getDay() === 0) {
            setModalError("Bookings are not available on Sundays.");
            return;
        }
        if (selectedDateObj < today && formatDate(selectedDateObj) !== formatDate(today)) {
             setModalError("Cannot book on a past date.");
            return;
        }
        
        // Check if selected slot is valid and not double-booked
        const potentialSlots = generateTimeSlots(selectedDateObj);
        if (!potentialSlots.includes(editedTime)) {
            setModalError("The selected time slot is invalid (e.g., outside hours, lunch break).");
            return;
        }
        const isSlotTakenByOther = allBookings.some(b =>
            b.id !== booking.id &&
            b.date === editedDateStr &&
            b.time === editedTime
        );
        if (isSlotTakenByOther) {
            setModalError("This time slot is already booked by another appointment.");
            return;
        }

        onSave({
            ...booking,
            name: editedName.trim(),
            email: editedEmail.trim(),
            date: editedDateStr,
            time: editedTime,
        });
    };
    
    const minDate = formatDate(new Date());


    if (!booking) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="editBookingTitle">
            <div className="modal-content admin-edit-modal-content">
                <h3 id="editBookingTitle" className="modal-title">Edit Booking</h3>
                {modalError && <p className="message error modal-error" role="alert">{modalError}</p>}
                <div className="admin-form-group">
                    <label htmlFor="editBookingName" className="admin-label">Name:</label>
                    <input id="editBookingName" type="text" value={editedName} onChange={e => setEditedName(e.target.value)} className="admin-input" />
                </div>
                <div className="admin-form-group">
                    <label htmlFor="editBookingEmail" className="admin-label">Email:</label>
                    <input id="editBookingEmail" type="email" value={editedEmail} onChange={e => setEditedEmail(e.target.value)} className="admin-input" />
                </div>
                <div className="admin-form-group">
                    <label htmlFor="editBookingDate" className="admin-label">Date:</label>
                    <input id="editBookingDate" type="date" value={editedDateStr} min={minDate} onChange={e => setEditedDateStr(e.target.value)} className="admin-input" />
                </div>
                <div className="admin-form-group">
                    <label htmlFor="editBookingTime" className="admin-label">Time:</label>
                    <select id="editBookingTime" value={editedTime} onChange={e => setEditedTime(e.target.value)} className="admin-select" disabled={availableTimes.length === 0}>
                        {availableTimes.length === 0 && editedDateStr && <option value="">No slots available</option>}
                        {availableTimes.map(timeSlot => (
                            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                        ))}
                         {/* If original time is valid for original date but not in new list, show it as an option if date hasn't changed*/}
                        {booking.date === editedDateStr && !availableTimes.includes(booking.time) && generateTimeSlots(new Date(booking.date  + 'T00:00:00')).includes(booking.time) && (
                            <option key={`current-${booking.time}`} value={booking.time}>{booking.time} (Current)</option>
                        )}
                    </select>
                </div>
                <div className="modal-actions">
                    <button onClick={handleSave} className="admin-button-primary">Save Changes</button>
                    <button onClick={onClose} className="admin-button-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

interface AdminPageProps {
  bookings: Booking[];
  deleteBooking: (id: string) => void;
  editBooking: (updatedBooking: Booking) => void;
  galleryImages: GalleryImage[];
  addGalleryImage: (src: string, alt: string, category: ImageCategory) => void;
  deleteGalleryImage: (id: string) => void;
  isAdmin: boolean;
  attemptLogin: (email: string, pass: string) => void;
  onGoBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  bookings,
  deleteBooking,
  editBooking,
  galleryImages: passedGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  isAdmin,
  attemptLogin,
  onGoBack
}) => {
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [adminView, setAdminView] = useState<'dashboard' | 'bookings' | 'gallery'>('dashboard');
  const [bookingSortOrder, setBookingSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [adminActionMessage, setAdminActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleLoginAttempt = () => {
    if (!adminEmailInput || !adminPasswordInput) {
        setLoginError("Please enter both email and password.");
        return;
    }
    attemptLogin(adminEmailInput, adminPasswordInput); 
    if (adminEmailInput !== ADMIN_EMAIL || adminPasswordInput !== ADMIN_PASSWORD) {
        setLoginError("Invalid admin email or password.");
    } else {
        setLoginError(null);
        setAdminView('dashboard'); 
    }
  };

  const handleDeleteBooking = (id: string) => {
    deleteBooking(id);
    setAdminActionMessage({type: 'success', text: 'Booking deleted successfully.'});
    setTimeout(() => setAdminActionMessage(null), 3000);
  };

  const handleOpenEditModal = (booking: Booking) => {
    setBookingToEdit(booking);
    setIsEditModalOpen(true);
    setAdminActionMessage(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setBookingToEdit(null);
  };

  const handleSaveChanges = (updatedBooking: Booking) => {
    editBooking(updatedBooking);
    handleCloseEditModal();
    setAdminActionMessage({type: 'success', text: 'Booking updated successfully.'});
    setTimeout(() => setAdminActionMessage(null), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="admin-page-login-container">
        <h2 className="page-title">Admin Access</h2>
        <div className="login-prompt">
          <p>Please enter admin credentials to access the panel.</p>
          <div className="admin-form-group">
            <input 
                type="email" 
                value={adminEmailInput} 
                onChange={e => { setAdminEmailInput(e.target.value); setLoginError(null); }}
                placeholder="Admin Email"
                aria-label="Admin Email Input"
                className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <input 
                type="password" 
                value={adminPasswordInput}
                onChange={e => { setAdminPasswordInput(e.target.value); setLoginError(null); }}
                placeholder="Password"
                aria-label="Admin Password Input"
                aria-describedby="loginError"
                className="admin-input"
            />
          </div>
          <button onClick={handleLoginAttempt} className="admin-button-primary login-button">Login</button>
          {loginError && <p id="loginError" className="message error" role="alert">{loginError}</p>}
        </div>
      </div>
    );
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return bookingSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="admin-panel-container"> 
      <AdminSidebar activeView={adminView} onSetView={setAdminView} onGoBack={onGoBack} />
      <main className="admin-main-content">
        {adminActionMessage && (
            <div className={`message ${adminActionMessage.type} admin-action-message`} role="alert">
                {adminActionMessage.text}
            </div>
        )}
        {adminView === 'dashboard' && (
            <AdminDashboardView 
                totalBookings={bookings.length} 
                totalGalleryImages={passedGalleryImages.length} 
            />
        )}
        {adminView === 'bookings' && (
            <AdminBookingsView 
                bookings={sortedBookings}
                sortOrder={bookingSortOrder}
                onSetSortOrder={setBookingSortOrder}
                onDeleteBooking={handleDeleteBooking}
                onEditBooking={handleOpenEditModal}
            />
        )}
        {adminView === 'gallery' && (
            <AdminGalleryView 
                galleryImages={passedGalleryImages}
                onAddImage={addGalleryImage}
                onDeleteImage={deleteGalleryImage}
            />
        )}
      </main>
      {isEditModalOpen && bookingToEdit && (
        <EditBookingModal
            booking={bookingToEdit}
            allBookings={bookings}
            onClose={handleCloseEditModal}
            onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const savedBookings = localStorage.getItem('baneFadesBookings');
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch (error) {
      console.error("Error loading bookings from localStorage:", error);
      return [];
    }
  });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => {
    try {
      const savedImages = localStorage.getItem('baneFadesGallery');
      return savedImages ? JSON.parse(savedImages) : [
          { id: 'placeholder1', src: 'https://picsum.photos/seed/haircut1/300/200', alt: 'Modern Haircut Example', category: 'Hair' },
          { id: 'placeholder2', src: 'https://picsum.photos/seed/shave2/300/200', alt: 'Classic Shave Example', category: 'Other' },
          { id: 'placeholder3', src: 'https://picsum.photos/seed/beard3/300/200', alt: 'Stylish Beard Trim', category: 'Beard' },
          { id: 'placeholder4', src: 'https://picsum.photos/seed/haircut2/300/200', alt: 'Fade Haircut', category: 'Hair' },
          { id: 'placeholder5', src: 'https://picsum.photos/seed/beardtrim2/300/200', alt: 'Long Beard Styling', category: 'Beard' },
      ];
    } catch (error) {
        console.error("Error loading gallery images from localStorage:", error);
        return [ 
            { id: 'placeholder1', src: 'https://picsum.photos/seed/haircut1/300/200', alt: 'Modern Haircut Example', category: 'Hair' },
            { id: 'placeholder2', src: 'https://picsum.photos/seed/shave2/300/200', alt: 'Classic Shave Example', category: 'Other' },
            { id: 'placeholder3', src: 'https://picsum.photos/seed/beard3/300/200', alt: 'Stylish Beard Trim', category: 'Beard' },
            { id: 'placeholder4', src: 'https://picsum.photos/seed/haircut2/300/200', alt: 'Fade Haircut', category: 'Hair' },
            { id: 'placeholder5', src: 'https://picsum.photos/seed/beardtrim2/300/200', alt: 'Long Beard Styling', category: 'Beard' },
        ];
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const adminStatus = sessionStorage.getItem('baneFadesAdmin');
    return adminStatus === 'true';
  });

  useEffect(() => {
    localStorage.setItem('baneFadesBookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('baneFadesGallery', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    sessionStorage.setItem('baneFadesAdmin', isAdmin.toString());
  }, [isAdmin]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0,0); 
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const deleteBooking = (id: string) => {
    setBookings(prevBookings => prevBookings.filter(b => b.id !== id));
  };
  
  const editBooking = (updatedBooking: Booking) => {
    setBookings(prevBookings => 
        prevBookings.map(b => b.id === updatedBooking.id ? updatedBooking : b)
    );
  };

  const addGalleryImage = (src: string, alt: string, category: ImageCategory) => {
    const newImage: GalleryImage = {
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      src,
      alt,
      category
    };
    setGalleryImages(prev => [newImage, ...prev]); 
  };
  
  const deleteGalleryImage = (id: string) => {
    setGalleryImages(prevImages => prevImages.filter(img => img.id !== id));
  };

  const attemptAdminLogin = (email: string, pass: string) => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setCurrentPage('admin'); 
    } else {
      setIsAdmin(false);
    }
  };

  const handleAdminAccess = () => {
    setCurrentPage('admin');
  };

  const handleGoBack = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (currentPage === 'admin') {
        return <AdminPage 
                  bookings={bookings} 
                  deleteBooking={deleteBooking}
                  editBooking={editBooking}
                  galleryImages={galleryImages}
                  addGalleryImage={addGalleryImage}
                  deleteGalleryImage={deleteGalleryImage}
                  isAdmin={isAdmin}
                  attemptLogin={attemptAdminLogin}
                  onGoBack={handleGoBack}
               />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'gallery':
        return <GalleryPage images={galleryImages} />;
      case 'booking':
        return <BookingPage bookings={bookings} addBooking={addBooking} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className={`app-container ${currentPage === 'admin' && isAdmin ? 'admin-view-active' : ''}`}>
      { !(currentPage === 'admin' && isAdmin) && 
        <Header currentPage={currentPage} onNavigate={navigate} onAdminAccess={handleAdminAccess} isAdmin={isAdmin} />
      }
      <main className={`main-content ${currentPage === 'admin' && isAdmin ? 'admin-main-full-width' : ''}`}>
        {renderPage()}
      </main>
      { !(currentPage === 'admin' && isAdmin) && 
        <Footer />
      }
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}