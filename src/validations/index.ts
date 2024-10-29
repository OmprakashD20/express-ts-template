import { TObject } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

import { ValidatorFactoryReturn } from "@/types";
import { ValidationError } from "@/utils/errors";

export default function ValidatorFactory<T>(
  schema: TObject
): ValidatorFactoryReturn<T> {
  const C = TypeCompiler.Compile(schema);

  function validate(data: T): T {
    const isValid = C.Check(data);
    if (isValid) {
      return data;
    }

    const error = Array.from(C.Errors(data))[0];

    const path = error.path.toString().slice(1);
    const expected = schema.properties[path]?.type || "unknown";
    const received = (data as Record<string, any>)[path];

    throw new ValidationError(
      `Path: "${path}", Expected: "${expected}", Received: "${received}"`
    );
  }

  return { schema, validate };
}
