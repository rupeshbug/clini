import { createFileRoute } from "@tanstack/react-router";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";

const schema = {
  title: "Test form",
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    age: {
      type: "number",
    },
  },
};

export const Route = createFileRoute("/patients")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return (
    <div>
      <Form
        schema={schema as any}
        validator={validator}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}
