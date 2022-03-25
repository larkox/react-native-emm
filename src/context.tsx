import React, {
  createContext,
  useEffect,
  useState,
  FunctionComponent,
  useContext,
  ComponentType,
} from 'react';
import Emm from './emm';

const initialContext = {};
const Context = createContext<any>(initialContext);

export function useManagedConfig<T>(): T {
  return useContext<T>(Context);
}

export const Provider: FunctionComponent = ({ children }) => {
  const [managed, setManaged] = useState<unknown>(initialContext);

  useEffect(() => {
    const config = Emm.getManagedConfig<unknown>();
    setManaged(config);
  }, []);

  useEffect(() => {
    const listener = Emm.addListener((config: unknown) => {
      setManaged(config);
    });

    return () => {
      listener.remove();
    };
  });

  return <Context.Provider value={managed}>{children}</Context.Provider>;
};

export function withManagedConfig<T>(
  Component: ComponentType<T>
): ComponentType<T> {
  return function ManagedConfigComponent(props) {
    return (
      <Context.Consumer>
        {(managedConfig: T) => (
          <Component {...props} managedConfig={managedConfig} />
        )}
      </Context.Consumer>
    );
  };
}

export default Context;
