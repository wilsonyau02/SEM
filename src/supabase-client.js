import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch dropdown options from Supabase (academician)
export async function fetchDropdownOptions() {
    try {
      const { data, error } = await supabase
        .from('Academician')
        .select('Branch'); 
  
      if (error) {
        console.error('Error fetching dropdown options:', error.message);
        return [];
      }
  
      if (data) {
        const options = data.map((item) => item.Branch);
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

// Function to fetch search options from Supabase (academician)
export async function searchAcademiciansByBranch(value) {
  try {
    const { data, error } = await supabase
      .from('Academician')
      .select('Name')
      .ilike('Name', `%${value}%`); // Use ilike to perform a case-insensitive search

    if (error) {
      console.error('Error fetching search results:', error.message);
      return [];
    }

    const searchResults = data.map((item) => ({
      value: item.Name,
      label: item.Name,
    }));
    return searchResults;
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