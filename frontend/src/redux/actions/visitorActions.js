import client from "../api/client";

export const incVisitCount = () => async (dispatch) => {
  try {
    dispatch({
      type: "INC_VISITOR_COUNT_REQUEST",
    });

    const { data } = await client.get("/visitor/increment");

    dispatch({
      type: "INC_VISITOR_COUNT_SUCCESS",
      payload: {
        message: data.message,
        visitors: data.vistorData.visitors,
        allVisitors: data.vistorData.allVisitors,
        uniqueVisitor: data.vistorData.uniqueVisitor,
      },
    });
  } catch (error) {
    dispatch({
      type: "INC_VISITOR_COUNT_FAILURE",
      payload: error.response.data.message,
    });
  }
};
