export const createConversationReducers = (
  state = { receiverToCreateConv: {} },
  action
) => {
  switch (action.type) {
    case "CREATE_CONVERSATION":
      return {
        ...state,
        receiverToCreateConv: [action.payload],
      };

    default:
      return state;
  }
};
