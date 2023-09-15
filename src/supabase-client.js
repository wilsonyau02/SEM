import { createClient } from "@supabase/supabase-js";
import { getCurrentDateTime } from "./components/timeUtils";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch dropdown options from Supabase (academician)
export async function fetchDropdownOptions() {
    try {
      const { data, error } = await supabase
        .from('Academician')
        .select('Position'); 
  
      if (error) {
        console.error('Error fetching dropdown options:', error.message);
        return [];
      }
  
      if (data) {
        const options = data.map((item) => item.Position);
        return options;
      } else {
        // Data is empty, handle accordingly
        console.error('No data retrieved from Supabase.');
        return [];
      }
    } catch (exception) {
      console.error('An error occurred:', exception.message);
      return [];
    }
}

// Function to fetch dropdown options from Supabase (academician)
export async function fetchDropdownOptionsDepartment() {
  try {
    const { data, error } = await supabase
      .from('Academician')
      .select('Department'); 

    if (error) {
      console.error('Error fetching dropdown options:', error.message);
      return [];
    }

    if (data) {
      const options = data.map((item) => item.Department);
      return options;
    } else {
      // Data is empty, handle accordingly
      console.error('No data retrieved from Supabase.');
      return [];
    }
  } catch (exception) {
    console.error('An error occurred:', exception.message);
    return [];
  }
}



// Function to display staffs from Supabase (academician)
export async function  fetchSupabaseData(table, selectedField, searchValue) {
  try {
    let query = supabase.from(table).select('*'); // Select all fields

    if (selectedField) {
      query = query.eq(selectedField, searchValue); // Apply a filter based on selectedField and searchValue
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered data:', error.message);
      return [];
    } else {
      return data;
    }
  } catch (exception) {
    console.error('An error occurred:', exception.message);
    return [];
  }
}

export async function storeIPAddress(event, userType) {
  try {
      const userID = (await supabase.auth.getUser()).data.user.id;

      const currentDateTime = getCurrentDateTime();
      console.log("userID", userID);
      console.log("storeIPAddress", event);

      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();

      const ip = data.ip;

      const { error } = await supabase.from("activity_log").insert([
          {
              ip_address: ip,
              event_name: event,
              time: currentDateTime,
              userID: userID, 
              userType: userType,
          },
      ]);
      if (error) {
          console.log("Error storing IP address:", error);
      }
  } catch (error) {
      console.error("Error storing IP address:", error);
  }
}