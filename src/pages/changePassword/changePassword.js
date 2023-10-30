import React, { useState, useEffect } from "react";
//import "./profile.scss";
import "devextreme-react/text-area";
import Form, {
  Item,
  SimpleItem,
  CompareRule,
  RequiredRule,
  ButtonItem,
  GroupItem,
} from "devextreme-react/form";
import { PasswordUpdate } from "../../api/MyOwnServices";
import { useAuth } from "../../contexts/auth";
import notify from "devextreme/ui/notify";

function ChangePasswordx(props) {
  const [PasswordValues, setPasswordValues] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: "",
  });
  //const clientUser = props.userCode;
  var oldPasswordvalidate = props.clientPassword;
  //const clientpassword=props.UserPassword;

  //setPasswordValues({ oldpassword: props.UserPassword });

  const passwordUpdate = (event) => {
    PasswordUpdate(props.clientUser, PasswordValues.newPassword);
    notify(
      {
        message: "You have updated your Password",
        position: {
          my: "center top",
          at: "center top",
        },
      },
      "success",
      3000
    );
    event.preventDefault();
  };

  const passwordComparison = (event) => {
    return props.clientPassword;
  };
  const passwordComparisonNew = (event) => {
    return PasswordValues.newPassword;
  };
  const validateForm = (event) => {
    if (oldPasswordvalidate !== PasswordValues.oldPassword) {
      notify(
        {
          message: "exiting password does not match password on file",
          position: {
            my: "center top",
            at: "center top",
          },
        },
        "failure",
        3000
      );
    }
  };

  const passwordOptions = {
    mode: "password",
  };

  const buttonOptions = {
    text: "Update",
    type: "success",
    useSubmitBehavior: true,
  };

  return (
    <React.Fragment>
      <div className="content-block dx-card responsive-paddings">
        <h6>Your Password Details</h6>
      </div>
      <div className="content-block dx-card responsive-paddings">
        <form onSubmit={passwordUpdate}>
          <Form
            onContentReady={validateForm}
            //colCountByScreen={colCountByScreen}
            id="form"
            formData={PasswordValues}
          >
            <GroupItem colCount={3}>
              <SimpleItem
                dataField="oldPassword"
                editorType="dxTextBox"
                editorOptions={passwordOptions}
              >
                <RequiredRule message="Password is required" />

                <CompareRule
                  message="This is not the current password"
                  comparisonTarget={passwordComparison}
                />
              </SimpleItem>
              <SimpleItem
                dataField="newPassword"
                editorType="dxTextBox"
                editorOptions={passwordOptions}
              >
                <RequiredRule message="Password is required" />
              </SimpleItem>
              <SimpleItem
                dataField="newPasswordAgain"
                editorType="dxTextBox"
                editorOptions={passwordOptions}
              >
                <RequiredRule message="Password is required" />

                <CompareRule
                  message="The Passwords do not Match"
                  comparisonTarget={passwordComparisonNew}
                />
              </SimpleItem>
            </GroupItem>
            <GroupItem>
              <ButtonItem
                horizontalAlignment="left"
                buttonOptions={buttonOptions}
              />
            </GroupItem>
          </Form>
        </form>
      </div>
    </React.Fragment>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

export default function ChangePassword() {
  const { user } = useAuth();
  return (
    <ChangePasswordx
      clientUser={user.userCode}
      clientPassword={user.UserPassword}
    />
  );
}
