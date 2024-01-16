import axios from 'axios';
import dayjs from 'dayjs';
import {toast} from 'react-toastify';

// Specify the baseURL of server
export const api = axios.create({
  baseURL: "fullstack-real-estate-five.vercel.app/api",
});

export const getAllProperties = async() => {
  try {
    const response = await api.get('/residency/allresd', {
      timeout: 10 * 1000, // 10 seconds timeout
    });

    if (response.status === 400 || response.status === 500){
      throw response.data
    }
    return response.data

  } catch (error) {
    toast.error('Something went wrong')
    throw error
  }
};

export const getProperty = async(id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000, // 10 seconds timeout
    });

    if (response.status === 400 || response.status === 500){
      throw response.data
    }
    return response.data

  } catch (error) {
    toast.error('Something went wrong')
    throw error
  }
}

export const createUser = async (email, token) => {
  try {
    await api.post(
      `/user/register`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const bookVisit = async(date, propertyId, email, token) => {
  try {
    const formattedDate = dayjs(date).format("DD/MM/YYYY")
    await api.post(
      `/user/bookVisit/${propertyId}`,
      {
        email,
        id: propertyId,
        date: formattedDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )

  } catch(error) {
    toast.error("Something went wrong, Please try again");
    throw error
  }
}

export const removeBooking = async (id, email, token) => {
  try {
    await api.post(
      `/user/removeBooking/${id}`,
      {
        email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

  } catch(error){
    toast.error("Something went wrong, Please try again");
    throw error
  }
}

export const toFav = async(id, email, token) => {
  try{
    await api.post(
      `/user/toFav/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  } catch(error) {
    throw error;
  }
}

export const getAllFav = async(email, token) => {
  if(!token) return
  try{

    const res = await api.post(
      `/user/allFav`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data["favResidenciesID"]

  }catch(error){
    toast.error("Something went wrong while fetching favs");
    throw error
  }
}

export const getAllBookings = async (email, token) => {

  if(!token) return
  try {  
    const res = await api.post(
      `/user/allBookings`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("getAllBookings res=>", res)
    return res.data["bookedVisits"]

  } catch (error) {
    toast.error("Something went wrong while fetching bookings");
    throw error
  }
}

export const createResidency = async (data, token) => {
  console.log(data)
  try {
    const res = await api.post(
      `/residency/create`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
    
  } catch (error) {
    throw error
  }
}