// App.js
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [message, setMessage] = useState('');
  const [showAddMeasurements, setShowAddMeasurements] = useState(false);
  const [waistMeasurements, setWaistMeasurements] = useState([]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === 'height') {
      setHeight(value);
    } else if (name === 'age') {
      setAge(value);
    } else if (name === 'weight') {
      setWeight(value);
    } else if (name === 'waist') {
      setWaist(value);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axios.get(`/api/get_measurements?height=${height}&age=${age}&weight=${weight}`)
      .then(response => {
        setWaistMeasurements(response.data.waist_measurements);
        let msg = response.data.waist_measurements.length > 0
          ? 'No match for your waist size? Add yours!'
          : 'Oops! No Waist Measurements found for the selected criteria. Add yours!';
        setMessage(msg);
        setShowAddMeasurements(true);
      })
      .catch(error => {
        console.log(error);
        setMessage('');
        setShowAddMeasurements(false);
        toast.error("Unable to get Measurements!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
      });
  };

  const handleAddMeasurement = (event) => {
    event.preventDefault();
    if (waist) {
      axios.post('/api/add_measurement', {
        "height": height,
        "age": age,
        "weight": weight,
        "waist": waist
      })
        .then(response => {
          setHeight('');
          setAge('');
          setWeight('');
          setWaist('');
          setMessage('');
          setWaistMeasurements([]);
          setShowAddMeasurements(false);
          toast.success("Measurements added Successfully!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000
          });
          console.log(response);
        })
        .catch(error => {
          setHeight('');
          setAge('');
          setWeight('');
          setWaist('');
          setMessage('');
          setWaistMeasurements([]);
          setShowAddMeasurements(false);
          console.log(error);
          toast.error("Unable to add Measurements!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000
          });
        });
    } else {
      toast.error("Enter valid waist Measurement!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  };

  return (
    <div className='container'>
      <h1>Measurement Filter</h1>
      <ToastContainer />
      <form onSubmit={handleFormSubmit}>

        <div className="row">
          <div className="col-25">
            <label className='labelClass'>
              <b>Height:</b>
            </label>
          </div>
          <div className="col-75">
            <input className='inputClass' type="number" name="height" value={height} onChange={handleInputChange} />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-25">
            <label className='labelClass'>
              <b>Age:</b>
            </label>
          </div>
          <div className="col-75">
            <input className='inputClass' type="number"
              name="age" value={age} onChange={handleInputChange} />
          </div>
        </div>
        <br />

        <div className="row">
          <div className="col-25">
            <label className='labelClass'>
              <b>Weight:</b>

            </label>
          </div>
          <div className="col-75">
            <input className='inputClass' type="number" name="weight" value={weight} onChange={handleInputChange} />
          </div>
        </div>
        <br />
        <button className='buttonClass' type="submit">Get Waist Sizes</button>

      </form>

      {waistMeasurements.length > 0 ? (
        <div>
          <h2>Waist Measurements:</h2>
          <div className='showCards'>
            {waistMeasurements.map((waist, index) => (
              <div className='card' key={index}>
                <div className="card-container">
                  {waist}
                </div>
              </div>
            ))}
          </div>
          <h2>{message}</h2>
        </div>
      ) : (
        <div>
          <h2>{message}</h2>
        </div>
      )}

      {showAddMeasurements && (
        <>
          <div className="row">
            <div className="col-25">
              <label className='labelClass'>
                <b>Your Waist Size:</b>
              </label>
            </div>
            <div className="col-75">
              <input className='inputClass' type="number" name="waist" value={waist} onChange={handleInputChange} />
            </div>
          </div>
          <br />
          <button className='buttonClass' onClick={handleAddMeasurement}>Add My Measurement</button>
        </>
      )}
    </div>
  );
}

export default App;
