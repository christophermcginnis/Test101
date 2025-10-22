"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import { graphQLFetch } from "../../lib/graphql";
import { loginSchema, signupSchema } from "../../lib/validation";
import { z } from "zod";

type Mode = "login" | "signup";

type FormState = {
  email: string;
  password: string;
  name?: string;
};

const mutationByMode: Record<Mode, { query: string; schema: z.ZodTypeAny; redirect: string }> = {
  signup: {
    query: /* GraphQL */ `
      mutation Signup($input: RegisterInput!) {
        registerUser(input: $input) {
          user {
            id
            email
          }
        }
      }
    `,
    schema: signupSchema,
    redirect: "/dashboard"
  },
  login: {
    query: /* GraphQL */ `
      mutation Login($input: LoginInput!) {
        loginUser(input: $input) {
          user {
            id
            email
          }
        }
      }
    `,
    schema: loginSchema,
    redirect: "/dashboard"
  }
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const config = useMemo(() => mutationByMode[mode], [mode]);

  const buttonLabel = mode === "signup" ? "Create account" : "Log in";
  const title = mode === "signup" ? "Join Community Circles" : "Welcome back";
  const alternateLabel = mode === "signup" ? "Already have an account?" : "New here?";
  const alternateHref = mode === "signup" ? "/auth/login" : "/auth/signup";
  const alternateCta = mode === "signup" ? "Log in" : "Create one";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setSubmitting(true);
    setErrors({});

    const submission =
      mode === "signup"
        ? { email: formState.email, password: formState.password, name: formState.name }
        : { email: formState.email, password: formState.password };

    const parseResult = config.schema.safeParse(submission);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        name: fieldErrors.name?.[0]
      });
      setSubmitting(false);
      return;
    }

    try {
      await graphQLFetch({
        query: config.query,
        variables: {
          input:
            mode === "signup"
              ? {
                  email: formState.email,
                  password: formState.password,
                  name: formState.name
                }
              : {
                  email: formState.email,
                  password: formState.password
                }
        }
      });
      router.push(config.redirect);
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">
          {mode === "signup" ? "Create your account to explore Community Circles." : "Enter your credentials to access your dashboard."}
        </p>
      </div>

      {mode === "signup" ? (
        <TextInput
          label="Name"
          name="name"
          placeholder="Casey Creator"
          value={formState.name ?? ""}
          error={errors.name}
          onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
          autoComplete="name"
        />
      ) : null}

      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formState.email}
        error={errors.email}
        onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
        autoComplete="email"
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="••••••••"
        value={formState.password}
        error={errors.password}
        onChange={(event) => setFormState((state) => ({ ...state, password: event.target.value }))}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
      />

      {serverError ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-600">{serverError}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-indigo-600 px-4 py-2 text-base font-semibold text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Please wait..." : buttonLabel}
      </button>

      <p className="text-center text-sm text-slate-500">
        {alternateLabel}{" "}
        <Link className="font-medium text-indigo-600" href={alternateHref}>
          {alternateCta}
        </Link>
      </p>
    </form>
  );
}
