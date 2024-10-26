import {createContext, ReactNode, Reducer, useContext} from 'react'
import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async';
import { isUserLoggedIn } from '../shared/TokenUtility';

interface UserState {
    username: string | null;
}

interface ActionType {
    type: string,
    username: string | null
}

type ContextProviderProps = {
    children: ReactNode,
  };

const UsersContext = createContext<{ state: UserState; dispatch: React.Dispatch<OuterAction> }>(null!);


const initialState: UserState = {
    username: null,
};

type InnerAction =
  | { type: 'SET_USERNAME', username: string | null }

export type OuterAction = 
    | { type: 'VERIFY_USER_LOGGED_IN' }
    | { type: 'LOGOUT_USER'}

type Action = InnerAction | OuterAction;

const reducer: Reducer<UserState, Action> = (state, action) => {
    switch (action.type) {
      case 'SET_USERNAME': {
        return {...state,
            username: action.username 
        }
      }
      default:
        throw new Error("Reducer couldn't match action to be executed.");
    }
  }

  const asyncActionHandlers: AsyncActionHandlers<Reducer<UserState, Action>, OuterAction> = {
    VERIFY_USER_LOGGED_IN: ({ dispatch, signal }) => async (action) => {
      try {
        const possibleUsername = await isUserLoggedIn()
        dispatch({type: "SET_USERNAME", username: possibleUsername})
      } catch (e:any ) {
        console.log(e);
        console.error(e.message);
      }
    },
    LOGOUT_USER: ({dispatch, signal}) => async (action) => {
        dispatch({type: "SET_USERNAME", username: null})
    }
  };

  export const UsersProvider = ({children}: ContextProviderProps) => {
    const [state, dispatch] = useReducerAsync<
    Reducer<UserState, Action>,
    OuterAction,
    OuterAction
  >(
    reducer,
    initialState,
    asyncActionHandlers,
  );

  
    return (
      <UsersContext.Provider value={{ state, dispatch }}>
        {children}
      </UsersContext.Provider>
    );
}
  
export const useUsersContext = () => {
    return useContext(UsersContext)
}