import React from "react";
import { Switch } from '@headlessui/react';

interface ISuperSwitch {
  label: string;
  description: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  isChild?: boolean;
  children?: any;
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const SuperSwitch = ({ label, description, enabled, setEnabled, isChild, children }: ISuperSwitch) => {
  return (
    <>
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className={classNames(
            'flex-grow flex flex-col p-4',
            isChild ? 'ml-4 pt-0' : ''
          )}>
          <Switch.Label as="span" className={classNames(
              'text-sm font-medium text-gray-900',
              isChild ? 'text-xs' : 'text-sm'
            )} passive>
            { label }
          </Switch.Label>
          <Switch.Description as="span" className={
              classNames(
                'text-gray-500',
                isChild ? 'text-xs' : 'text-sm'
              )}>
            { description }
          </Switch.Description>
        </span>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? 'bg-indigo-600' : 'bg-gray-200',
            isChild ? 'h-5 w-10' : 'h-6 w-11',
            'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? 'translate-x-5' : 'translate-x-0',
              isChild ? 'h-4 w-4' : 'h-5 w-5',
              'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
            )}
          />
        </Switch>
      </Switch.Group>
      {children}
    </>
  );
}

export default SuperSwitch;