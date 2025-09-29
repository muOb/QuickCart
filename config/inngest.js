import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ name: "quickcart-next" }); // use name, not id

// User creation event
export const syncUserCreation = inngest.createFunction(
  { name: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await step.run("save-user", async () => {
      await connectDB();
      await User.create(userData);
    });
  }
);

// User update event
export const syncUserUpdation = inngest.createFunction(
  { name: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await step.run("update-user", async () => {
      await connectDB();
      await User.findByIdAndUpdate(id, userData);
    });
  }
);

// User deletion event
export const syncUserDeletion = inngest.createFunction(
  { name: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const { id } = event.data;
    await step.run("delete-user", async () => {
      await connectDB();
      await User.findByIdAndDelete(id);
    });
  }
);
