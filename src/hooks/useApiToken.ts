import axios from "axios";
import type { BearerTokenParam } from "../types";
import { config } from "../config/config";
import { useCallback } from "react";

export const useApiToken = () => {
  const getApiToken = useCallback(
    async ({ token, url, responseKey }: BearerTokenParam) => {
      try {
        const bearer = `Bearer ${token}`;
        const response = await axios.get(`${config.API_URL}/${url}`, {
          headers: {
            Authorization: bearer,
          },
        });
        const data = responseKey
          ? response?.data?.[responseKey]
          : response?.data;
        return data;
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const getApiTokenWhats = useCallback(
    async ({ token, url, responseKey }: BearerTokenParam) => {
      try {
        const bearer = `Bearer ${token}`;
        const response = await axios.get(
          `${config.VITE_API_WHATSAPP_URL}/${url}`,
          {
            headers: {
              Authorization: bearer,
            },
          },
        );
        const data = responseKey
          ? response?.data?.[responseKey]
          : response?.data;
        return data;
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const postApiToken = useCallback(
    async ({ token, url, responseKey, body }: BearerTokenParam) => {
      try {
        const bearer = `Bearer ${token}`;
        const response = await axios.post(
          `${config.VITE_API_WHATSAPP_URL}/${url}`,
          body,
          {
            headers: {
              Authorization: bearer,
            },
          },
        );
        const data = responseKey
          ? response?.data?.[responseKey]
          : response?.data;
        return data;
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const postApiTokenAuth = useCallback(
    async ({ token, url, responseKey, body }: BearerTokenParam) => {
      try {
        const bearer = `Bearer ${token}`;
        const response = await axios.post(`${config.API_URL}/${url}`, body, {
          headers: {
            Authorization: bearer,
          },
        });
        const data = responseKey
          ? response?.data?.[responseKey]
          : response?.data;
        return data;
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const postFormDataApiToken = async ({
    token,
    cloudflareToken = "X-Turnstile-Token",
    url,
    responseKey,
    formData,
    params,
  }: BearerTokenParam) => {
    try {
      const bearer = `Bearer ${token}`;
      const rawUrl = `${config.VITE_API_WHATSAPP_URL}/${url}`;
      const response = await axios.post(rawUrl, formData, {
        params,
        headers: {
          Authorization: bearer,
          "X-Turnstile-Token": cloudflareToken,
        },
      });

      const data = responseKey ? response?.data?.[responseKey] : response?.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getApiToken,
    getApiTokenWhats,
    postApiToken,
    postApiTokenAuth,
    postFormDataApiToken,
  };
};
