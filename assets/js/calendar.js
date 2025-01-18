import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import {Audio} from "react-loader-spinner";

function Calendar() {
    const [userDreams, setUserDreams] = useState(null);
    const [events, setEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(moment().date(1));
    const [selectedDay, setSelectedDay] = useState(null); // State to track selected day
    const [isLoading, setIsLoading]= useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('email');
        // Fetch data for the current user
        axios.get(`/api/dreams`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                'owner.email': email,
                'itemsPerPage':50
            }
        })
            .then(response => {
                setUserDreams(response.data['hydra:member']);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    useEffect(() => {

        if (userDreams) {
            const formattedDreams = userDreams.map(dream => ({
                ...dream,
                date: moment(dream.date)
            }));
            setEvents(formattedDreams);
        }
    }, [userDreams]);

    const drawHeader = () => {
        return (
            <div className="header">
                <h1>{currentMonth.format('MMMM YYYY')}</h1>
                <div className="right" onClick={nextMonth}></div>
                <div className="left" onClick={prevMonth}></div>
            </div>
        );
    };

    const getDayClass = (day) => {
        const classes = ['day'];
        if (day.month() !== currentMonth.month()) {
            classes.push('other');
        } else if (moment().isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    };

    const renderEvents = (day) => {
        const todaysEvents = events.filter(ev => moment(ev.date).isSame(day, 'day'));

        if (todaysEvents.length > 0) {
            return (
                <div className="day-events">
                    {todaysEvents.map((ev, index) => (
                        <span className="blue" key={index}></span>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };

    const openDay = (el) => {
        const dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
        const day = currentMonth.clone().date(dayNumber);
        if(selectedDay){
            if(day.format('DD MM Y') === selectedDay.format('DD MM Y')) setSelectedDay(null);
            else setSelectedDay(day);
        } else setSelectedDay(day);
    };

    const renderDayDetails = (day) => {
        const todaysEvents = events.filter(ev => moment(ev.date).isSame(day, 'day'));

        return (
            <div className="details in">
                <div className="arrow" style={{ left: `${day.day() * 14.28 + 1}%` }}></div>
                {todaysEvents.length > 0 ? (
                    todaysEvents.map((ev, index) => (
                        <div key={index} className="event">
                            <div className="event-category blue"></div>
                            <span onClick={ ()=>
                            {window.location.href = `/dreams/${ev['@id'].split('/').pop()}`}}>
                                {ev.title}</span>
                            <span onClick={ ()=>
                            {window.location.href = `/dreams/${ev['@id'].split('/').pop()}`}}>
                                {ev.dream_content}</span>
                        </div>
                    ))
                ) : (
                    <div className="dream empty">
                        <span>No Dreams</span>
                    </div>
                )}
            </div>
        );
    };

    const drawMonth = () => {
        const daysInMonth = currentMonth.daysInMonth();
        const firstDayOfMonth = currentMonth.clone().startOf('month');
        const startingDayOfWeek = firstDayOfMonth.day();

        const days = [];
        let day = firstDayOfMonth.clone().subtract(startingDayOfWeek, 'days');

        for (let i = 0; i < 6 * 7; i++) {
            const isSelectedDay = selectedDay && day.isSame(selectedDay, 'day');

            days.push(
                <div
                    className={getDayClass(day)}
                    key={day.format('YYYY-MM-DD')}
                    onClick={(e) => openDay(e.currentTarget)}
                >
                    <div className="day-name">{day.format('ddd')}</div>
                    <div className="day-number">{day.format('DD')}</div>
                    {renderEvents(day)}
                    {isSelectedDay && renderDayDetails(day)}
                </div>
            );
            day.add(1, 'day');
        }

        return (
            <div className="month">
                {days}
            </div>
        );
    };

    const nextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'month'));
    };

    const prevMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
    };

    return (
        isLoading ? (
            <div className="loading">
                <Audio
                    height="150"
                    width="150"
                    radius="9"
                    color="#263238"
                    ariaLabel="three-dots-loading"
                    wrapperStyle
                    wrapperClass
                />
            </div>
        ) : (
            <div id="calendar">
                {drawHeader()}
                {drawMonth()}
            </div>
        )
    );
}

createRoot(document.getElementById('root')).render(<Calendar />);
