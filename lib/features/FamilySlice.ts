import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Kid {
    id: number;
    name: string;
    class: string;
}

interface Family {
    id: number;
    name: string,
    father: string;
    mother: string;
    members?: Kid[];
    kids: number
}

interface FamilyState {
    families: Family[];
}

const initialState: FamilyState = {
    families: [],
};

const familySlice = createSlice({
    name: "family",
    initialState,
    reducers: {
        // Action to set all families
        setFamily(state, action: PayloadAction<Family[]>) {
            console.log(action.payload);
            
            state.families = action.payload;
        },

        // Action to add a new family
        addFamily(state, action: PayloadAction<Family>) {
            state.families.push(action.payload);
        },

        // Action to edit an existing family
        updateFamily(state, action: PayloadAction<Family>) {
            const index = state.families.findIndex(
                (family) => family.id === action.payload.id
            );
            if (index !== -1) {
                state.families[index] = action.payload;
            }
        },

        // Action to delete a family
        deleteFamily(state, action: PayloadAction<number>) {
            state.families = state.families.filter(
                (family) => family.id !== action.payload
            );
        },
      
        

    },
});

// Export actions
export const { setFamily, addFamily, updateFamily, deleteFamily } = familySlice.actions;

// Export the reducer
export default familySlice.reducer;
