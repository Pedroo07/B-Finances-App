import AsyncStorage from "@react-native-async-storage/async-storage";
import z from "zod";

const userSchema = z.object({
  email: z.email("Email Invalid"),
  password: z.string().min(8).max(14).regex(/[a-z]/).regex(/[0-9]/),
});
const userEmail = z.object({
  email: z.email("Email Invalid"),
});
const userPassword = z.object({
  password: z.string().min(8).max(14).regex(/[a-z]/).regex(/[0-9]/),
});
type UserEmail = z.infer<typeof userEmail>;
type UserPassword = z.infer<typeof userPassword>;
type User = z.infer<typeof userSchema>;

export const signIn = async ({ email, password }: User) => {
  const parsed = userSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );
    const data = await res.json();
    if (data.error) {
      const message = data.error.message;
      if (message === "EMAIL_NOT_FOUND")
        return {
          success: false,
          error: "user does not exist",
        };
      if (message === "INVALID_PASSWORD")
        return {
          success: false,
          error: "The password is invalid.",
        };
      if (message === "USER_DISABLED")
        return {
          success: false,
          error: "The user account has been disabled by an administrator.",
        };
      return { success: false, error: "Error logging in" };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error connecting to the server.",
    };
  }
};

export const signUp = async ({ email, password }: User) => {
  const parsed = userSchema.safeParse({ email, password });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error!.issues[0].message,
    };
  }
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );
    const data = await res.json();
    if (data.error) {
      const message = data.error.message;
      if (message === "EMAIL_EXISTS") {
        return { success: false, error: "Este email já está cadastrado." };
      }

      if (message === "INVALID_EMAIL") {
        return { success: false, error: "Email inválido." };
      }

      if (message === "WEAK_PASSWORD") {
        return { success: false, error: "A senha é muito fraca." };
      }

      return { success: false, error: "Erro ao criar conta." };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error ao conectar ao servidor",
    };
  }
};

export const updateEmail = async ({ email }: UserEmail) => {
  const idToken = await AsyncStorage.getItem("token");
  const parsed = userEmail.safeParse({ email });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "VERIFY_AND_CHANGE_EMAIL",
          idToken,
          newEmail: email,
        }),
      }
    );

    const data = await res.json();
    if (data.error) {
      const message = data.error.message;
      if (message === "EMAIL_EXISTS")
        return {
          success: false,
          error: "The email address is already in use by another account.",
        };
      if (message === "INVALID_ID_TOKEN")
        return {
          success: false,
          error:
            "The user's credential is no longer valid. The user must sign in again.",
        };
      return { success: false, error: "Error logging in" };
    }
    return {
      success: true,
      message: "email send",
      data,
    };
  } catch {
    return {
      success: false,
      error: "Error connecting to the server.",
    };
  }
};
export const updatePassword = async ({ password }: UserPassword) => {
  const idToken = await AsyncStorage.getItem("token");
  const parsed = userPassword.safeParse({ password });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    const data = await res.json();
    console.log("PASSWORD RESULT ===>", data);
    if (data.error) {
      const message = data.error.message;
      if (message === "WEAK_PASSWORD")
        return {
          success: false,
          error: "The password must be 6 characters long or more.",
        };
      if (message === "INVALID_ID_TOKEN")
        return {
          success: false,
          error:
            "The user's credential is no longer valid. The user must sign in again.",
        };
      return { success: false, error: "Error logging in" };
    }
    return {
      success: true,
      message: "passowd changed",
      data,
    };
  } catch {
    return {
      success: false,
      error: "Error connecting to the server.",
    };
  }
};
