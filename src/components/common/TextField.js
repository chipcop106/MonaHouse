import React, { useEffect, useState } from "react";
import { Input } from "@ui-kitten/components";
const TextField = (props) => {
  const [value, setValue] = useState(props?.value ?? "");
  const _onChangeText = (text) => {
    setValue(text);
  };
  const _onEndEditing = (text) => {
    props.textChange(text);
  };
  return (
    <Input
      {...props}
      value={value}
      onChangeText={_onChangeText}
      onEndEditing={_onEndEditing}
    />
  );
};

export default TextField;
