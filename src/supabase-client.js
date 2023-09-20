import { createClient } from "@supabase/supabase-js";
import { getCurrentDateTime } from "./components/timeUtils";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch dropdown options from Supabase (academician)
export async function fetchDropdownOptions() {
  try {
    const { data, error } = await supabase
      .from("Academician")
      .select("Position");

    if (error) {
      console.error("Error fetching dropdown options:", error.message);
      return [];
    }

    if (data) {
      const options = data.map((item) => item.Position);
      return options;
    } else {
      // Data is empty, handle accordingly
      console.error("No data retrieved from Supabase.");
      return [];
    }
  } catch (exception) {
    console.error("An error occurred:", exception.message);
    return [];
  }
}

// Function to fetch dropdown options from Supabase (academician)
export async function fetchDropdownOptionsDepartment() {
  try {
    const { data, error } = await supabase
      .from("Academician")
      .select("Department");

    if (error) {
      console.error("Error fetching dropdown options:", error.message);
      return [];
    }

    if (data) {
      const options = data.map((item) => item.Department);
      return options;
    } else {
      // Data is empty, handle accordingly
      console.error("No data retrieved from Supabase.");
      return [];
    }
  } catch (exception) {
    console.error("An error occurred:", exception.message);
    return [];
  }
}

// Function to fetch data for the dedicated program
export async function fetchProgramData(progLvl) {
  try {
    const { data, error } = await supabase
      .from('Programme')  // Replace 'yourTableName' with the name of your table in Supabase
      .select('*')
      .eq('progLvl', progLvl); // Filter by the program level
    
    if (error) {
      console.error('Error fetching program data:', error.message);
      return [];
    } else {
      return data;  // Return the fetched program details
    }
  } catch (exception) {
    console.error('An error occurred:', exception.message);
    return [];
  }
}

// Function to fetch data for whole Programme table
export async function fetchProgrammeData() {
  try {
    const { data, error } = await supabase
      .from('Programme')  // Replace 'yourTableName' with the name of your table in Supabase
      .select('*');
    
    if (error) {
      console.error('Error fetching programme data:', error.message);
      return [];
    } else {
      return data;  // Return the fetched programme details
    }
  } catch (exception) {
    console.error('An error occurred:', exception.message);
    return [];
  }
}



// Function to display staffs from Supabase (academician)
export async function fetchSupabaseData(table, selectedField, searchValue) {
  try {
    let query = supabase.from(table).select("*"); // Select all fields

    if (selectedField) {
      query = query.eq(selectedField, searchValue); // Apply a filter based on selectedField and searchValue
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered data:", error.message);
      return [];
    } else {
      return data;
    }
  } catch (exception) {
    console.error("An error occurred:", exception.message);
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

// Function to post an inquiry to Supabase (inquiry)
export async function postInquiry(inquiry, userSession) {
  try {
    const { data, error } = await supabase
      .from("inquiry")
      .insert([{ content: inquiry, author: userSession }])
      .select();

    if (error) {
      console.error("Error posting inquiry:", error.message);
    }
  } catch (exception) {
    console.error("An error occurred:", exception.message);
  }
}

// Function to fetch inquiries from Supabase (inquiry)
export async function fetchInquiries() {
  try {
    let { data: inquiry, error } = await supabase
      .from("inquiry")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error.message);
      return [];
    }

    if (inquiry) {
      return inquiry;
    } else {
      // Data is empty, handle accordingly
      console.error("No data retrieved from Supabase.");
      return [];
    }
  }
  catch (exception) {
    console.error("An error occurred:", exception.message);
    return [];
  }
}

// Funtion to fetch students from supabase (student)
export async function fetchStudents() {
  try {
    let { data: student, error } = await supabase.from("student").select("*");

    if (error) {
      console.error("Error fetching students:", error.message);
      return [];
    }

    if (student) {
      return student;
    } else {
      // Data is empty, handle accordingly
      console.error("No data retrieved from Supabase.");
      return [];
    }
  } catch (exception) {
    console.error("An error occurred:", exception.message);
    return [];
  }
}

export async function updateInquiryResponse(updatedInquiry, response, userId) {
  try {
    const respondedAt = new Date(); 
    const { data, error } = await supabase
      .from("inquiry")
      .update({
        response: response,
        respondent: userId,
        status: "answered",
        responded_at: respondedAt, 
      })
      .eq("inquiry_id", updatedInquiry);

    if (error) {
      console.error("Error updating inquiry:", error.message);
    }
  } catch (exception) {
    console.error("An error occurred:", exception.message);
  }
}


