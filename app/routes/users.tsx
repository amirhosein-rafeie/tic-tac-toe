import { User } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  return json({
    users: await db.user.findMany(),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = Object.fromEntries(formData) as unknown as User;
  await db.user.create({ data });
  return redirect("/users");
};

export default function TodosRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <Form method="post">
        <label htmlFor="first_name">First Name</label>
        <input name="first_name" id="first_name" />
        <label htmlFor="last_name">Last Name</label>
        <input name="last_name" id="last_name" />
        <label htmlFor="email">Email</label>
        <input name="email" id="email" />
        <button type="submit">submit</button>
      </Form>
      <h1>Our Users:</h1>
      {data.users.map((user) => (
        <h4 key={user.id}>{user.first_name + " " + user.last_name}</h4>
      ))}
    </div>
  );
}
