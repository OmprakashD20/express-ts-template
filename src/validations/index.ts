import { TObject } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

import { ValidatorFactoryReturn } from "@/types";

export default function ValidatorFactory<T>(
  schema: TObject
): ValidatorFactoryReturn<T> {
  const C = TypeCompiler.Compile(schema);

  function validate(data: T): T {
    const isValid = C.Check(data);
    if (isValid) {
      return data;
    }

    const errors = Array.from(C.Errors(data)).map(({ path, message }) => ({
      path,
      message,
    }));

    const errorMessages = errors.map((error) => {
      const path = error.path.toString().slice(1);
      const expected = schema.properties[path]?.type || "unknown";
      const received = (data as Record<string, any>)[path];
      return `\nPath: "${path}", Expected: "${expected}", Received: "${received}"`;
    });

    throw new Error(`\nValidation Errors: ${errorMessages}`);
  }

  return { schema, validate };
}
