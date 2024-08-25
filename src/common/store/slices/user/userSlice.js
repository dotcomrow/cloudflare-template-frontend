import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STATE, ERROR } from "../../../utilities/constants";

let preferencesUrl = "https://api-gateway.dev.suncoast.systems/nodejs-cloudflare-service-template";
let googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
let googleProfileUrl =
  "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=";
let googleClientId =
  "488218567442-uj3hsd9g13so40fgc89srllfeoiuqeer.apps.googleusercontent.com";

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/";
};

export const getDarkMode = (user) => {
  if (user && user.user_settings && user.user_settings.preferences) {
    if (user.user_settings.preferences.systemSetting === "true") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    } else {
      return user.user_settings.preferences.darkMode === "true" ? true : false;
    }
  } else {
    return false;
  }
};

export const updatePreference = createAsyncThunk(
  "user/updatePreference",
  async (arg, thunkAPI) => {
    var prefs = {};
    Object.keys(arg).forEach((key) => {
      prefs[key] = arg[key];
    });
    return await axios(preferencesUrl, {
      method: "PUT",
      data: prefs,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
);

export const fetchPreferences = createAsyncThunk(
  "user/fetchPreferences",
  async (arg, thunkAPI) => {
    return await axios(preferencesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + arg,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        localStorage.setItem(ERROR, JSON.stringify({
          error: "unable to fetch preferences"
        }));
        throw error;
      });
  }
);

export const fetchGoogleProfile = createAsyncThunk(
  "user/fetchGoogleProfile",
  async (arg, thunkAPI) => {
    return await axios(googleProfileUrl + arg, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        localStorage.setItem(ERROR, JSON.stringify({
          error: "unable to fetch profile"
        }));
        throw error;
      });
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (arg, thunkAPI) => {
    var fragmentString = window.location.hash.substring(1);
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(fragmentString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    window.location.hash = "";
    if (params.error) {
      localStorage.setItem(ERROR, JSON.stringify(params));
      return;
    }
    if (Object.keys(thunkAPI.getState().user).length == 0) {
      if (Object.keys(params).length > 0) {
        if (params["state"] && params["state"] == localStorage.getItem(STATE)) {
          
          return await new Promise((resolve, reject) => {
            resolve(params);
            thunkAPI.dispatch(fetchGoogleProfile(params.access_token));
            thunkAPI.dispatch(fetchPreferences(params.access_token));
            localStorage.removeItem(STATE);
          });
        } else {
          localStorage.setItem(ERROR, JSON.stringify({
            error: "state mismatch, please close browser and try again"
          }));
          return;
        }
      } else {
        var form = document.createElement("form");
        form.setAttribute("method", "GET"); // Send as a GET request.
        form.setAttribute("action", googleAuthUrl);
        // Parameters to pass to OAuth 2.0 endpoint.
        if (localStorage.getItem(STATE)) {
          localStorage.removeItem(STATE);
        }
        var now = new Date();
        localStorage.setItem(STATE, now.getTime());
        var params = {
          client_id: googleClientId,
          redirect_uri: window.location.protocol + "//" + window.location.host,
          scope: "email profile openid",
          state: localStorage.getItem(STATE),
          include_granted_scopes: "true",
          response_type: "token",
        };

        // Add form parameters as hidden input values.
        for (var p in params) {
          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", p);
          input.setAttribute("value", params[p]);
          form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
      }
    } else {
      var now = new Date().getTime();
      var expires = 3;
      try {
        expires = parseInt(thunkAPI.getState().user.expires_in);
      } catch (e) {}
      if (
        now >
        new Date(
          parseInt(thunkAPI.getState().user.state) + expires * 1000
        ).getTime()
      ) {
        thunkAPI.dispatch({ type: "LOGOUT" });
      }
    }
  }
);

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if (action.payload) {
        Object.keys(action.payload).forEach((key) => {
          state[key] = action.payload[key];
        });
      }
    });
    builder.addCase(fetchGoogleProfile.fulfilled, (state, action) => {
      if (action.payload) {
        Object.keys(action.payload).forEach((key) => {
          state[key] = action.payload[key];
        });
      }
      state.loading = "complete";
    });
    builder.addCase(fetchPreferences.fulfilled, (state, action) => {
      if (!state.user_settings) {
        state.user_settings = {};
      }
      if (action.payload) {
        Object.keys(action.payload).forEach((key) => {
          state.user_settings[key] = action.payload[key];
        });
      }
      state.user_settings.loading = "complete";
    });
    builder.addCase(updatePreference.fulfilled, (state, action) => {
      if (action.payload) {
        var currentPreferences = state.user_settings.preferences;

        var newPreferences = action.payload.preferences;
        Object.keys(newPreferences).forEach((key) => {
          currentPreferences[key] = newPreferences[key];
        });
        state.user_settings.preferences = currentPreferences;
      }
    });
  },
});

export const { fetchUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
