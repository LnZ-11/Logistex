import { NextResponse } from "next/server";

// Les utilisateurs sont lus depuis les variables d'environnement du fichier .env
// Format attendu : AUTH_USER_001="motdepasse:NomComplet"
function getUsers(): Record<string, { password: string; name: string }> {
  const users: Record<string, { password: string; name: string }> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("AUTH_USER_") && value) {
      const userId = key.replace("AUTH_USER_", "");
      const [password, ...nameParts] = value.split(":");
      const name = nameParts.join(":") || `Utilisateur ${userId}`;
      users[userId] = { password, name };
    }
  }

  return users;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { message: "Numéro d'utilisateur et mot de passe requis." },
        { status: 400 }
      );
    }

    const users = getUsers();
    const user = users[userId.trim()];

    if (!user || user.password !== password) {
      // Small delay to prevent brute force
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json(
        { message: "Numéro d'utilisateur ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json(
      { message: "Connexion réussie.", name: user.name },
      { status: 200 }
    );

    response.cookies.set("logistex_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
