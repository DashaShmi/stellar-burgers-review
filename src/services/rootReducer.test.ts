import { initialBurgerState } from "./slices/burger-slice";
import { initialUserState } from "./slices/user-slice";
import { rootReducer } from "./store";

describe('root reducer', () => {

  test('имеет правильный начальный стейт', async () => {
    const emptyStateFake = { burger: initialBurgerState, user: initialUserState }

    const newState = rootReducer(undefined, { type: "UNKNOWN_ACTION" });

    expect(newState).toEqual(emptyStateFake);
  });
});
