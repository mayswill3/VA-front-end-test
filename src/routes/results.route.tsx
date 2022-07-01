import { h, JSX } from 'preact'
import { useRouter } from "preact-router";
import { useEffect, useState } from 'preact/hooks';
import SearchComponent from '../components/search.component';
import { doRequest } from '../services/http.service';
import { BookingRequest, BookingResponse, Holiday } from '../types/booking';
import { DateTime } from 'luxon';

export default function ResultsRoute(): JSX.Element {
    const [searchParams] = useRouter();
    const [results, setResults] = useState<Holiday[]>([])
    const [filter, setFilter] = useState('clear')
    
    useEffect(() => {
        const departureDate = DateTime.fromFormat(searchParams?.matches?.departureDate, "yyyy-MM-dd").toFormat("dd-MM-yyyy");
        const requestBody: BookingRequest = {
            "bookingType": "holiday",
            "location": searchParams?.matches?.location as string,
            "departureDate": departureDate,
            "duration": searchParams?.matches?.duration as unknown as number,
            "gateway": "LHR",
            "partyCompositions": [
                {
                    "adults": searchParams?.matches?.adults as unknown as number,
                    "childAges": [],
                    "infants": 0
                }
            ]
        }

        doRequest('POST', '/cjs-search-api/search', requestBody)
            .then((response: any | BookingResponse) => {
                // Results are loaded here
                setResults(response.holidays) 
            })
    }, [searchParams])

    return (
        <section>
            <SearchComponent />
            <h1>Results should display here.</h1>
            <button onClick={() =>setFilter('priceperperson')}>Price Per Person</button>
            <button onClick={() =>setFilter('hotelFacilities')}>Hotel Facilities:</button>
            <button onClick={() =>setFilter('starRating')}>Star Rating:</button>
            <button onClick={() =>setFilter('clear')}>Clear</button>
            <div>
                {results.length &&
                    results.map(result =>(
                        <div>
                       { (filter  === 'clear' || filter  === 'priceperperson')  && <p><b>Price per person:</b> {result.pricePerPerson}</p>}
                       { (filter  === 'clear' || filter  === 'hotelFacilities') && <p><b>Hotel Facilities:</b> {result.hotel.content.hotelFacilities.map(facilities => (
                            facilities
                        ))}</p>}
                        { (filter  === 'clear' || filter  === 'starRating') && <p><b>Star Rating:</b> {result.hotel.content.starRating}</p>}
                        <hr/>
                        </div>
                      
                    ))
                }
            </div>
        </section>
    )
}