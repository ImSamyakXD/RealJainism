'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PanchangData {
  month: string;
  paksha: string;
  tithi: string;
}

interface KalyanakData {
  tirthankar: string | null;
  kalyanak_type: string | null;
}

interface SunData {
  sunrise: string;
  sunset: string;
}

const panchangJson: Record<string, PanchangData> = {
  "2026-07-01": { month: "Ashadh", paksha: "Krishna", tithi: "Pratipada" },
  "2026-07-02": { month: "Ashadh", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-07-03": { month: "Ashadh", paksha: "Krishna", tithi: "Tritiya" },
  "2026-07-04": { month: "Ashadh", paksha: "Krishna", tithi: "Chaturthi" },
  "2026-07-05": { month: "Ashadh", paksha: "Krishna", tithi: "Panchami" },
  "2026-07-06": { month: "Ashadh", paksha: "Krishna", tithi: "Shashthi" },
  "2026-07-07": { month: "Ashadh", paksha: "Krishna", tithi: "Saptami" },
  "2026-07-08": { month: "Ashadh", paksha: "Krishna", tithi: "Ashtami" },
  "2026-07-09": { month: "Ashadh", paksha: "Krishna", tithi: "Navami" },
  "2026-07-10": { month: "Ashadh", paksha: "Krishna", tithi: "Dashami-Ekadashi" },
  "2026-07-11": { month: "Ashadh", paksha: "Krishna", tithi: "Dwadashi" },
  "2026-07-12": { month: "Ashadh", paksha: "Krishna", tithi: "Trayodashi" },
  "2026-07-13": { month: "Ashadh", paksha: "Krishna", tithi: "Chaturdashi" },
  "2026-07-14": { month: "Ashadh", paksha: "Krishna", tithi: "Amavasya" },
  "2026-07-15": { month: "Ashadh", paksha: "Shukla", tithi: "Pratipada" },
  "2026-07-16": { month: "Ashadh", paksha: "Shukla", tithi: "Dwitiya-Tritiya" },
  "2026-07-17": { month: "Ashadh", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-07-18": { month: "Ashadh", paksha: "Shukla", tithi: "Panchami" },
  "2026-07-19": { month: "Ashadh", paksha: "Shukla", tithi: "Shashthi" },
  "2026-07-20": { month: "Ashadh", paksha: "Shukla", tithi: "Saptami" },
  "2026-07-21": { month: "Ashadh", paksha: "Shukla", tithi: "Ashtami" },
  "2026-07-22": { month: "Ashadh", paksha: "Shukla", tithi: "Navami" },
  "2026-07-23": { month: "Ashadh", paksha: "Shukla", tithi: "Dashami" },
  "2026-07-24": { month: "Ashadh", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-07-25": { month: "Ashadh", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-07-26": { month: "Ashadh", paksha: "Shukla", tithi: "Dwadashi" },
  "2026-07-27": { month: "Ashadh", paksha: "Shukla", tithi: "Trayodashi" },
  "2026-07-28": { month: "Ashadh", paksha: "Shukla", tithi: "Chaturdashi" },
  "2026-07-29": { month: "Ashadh", paksha: "Shukla", tithi: "Purnima" },
  "2026-07-30": { month: "Shravan", paksha: "Krishna", tithi: "Pratipada" },
  "2026-07-31": { month: "Shravan", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-08-01": { month: "Shravan", paksha: "Krishna", tithi: "Tritiya" },
  "2026-08-02": { month: "Shravan", paksha: "Krishna", tithi: "Chaturthi" },
  "2026-08-03": { month: "Shravan", paksha: "Krishna", tithi: "Panchami" },
  "2026-08-04": { month: "Shravan", paksha: "Krishna", tithi: "Shashthi" },
  "2026-08-05": { month: "Shravan", paksha: "Krishna", tithi: "Saptami" },
  "2026-08-06": { month: "Shravan", paksha: "Krishna", tithi: "Ashtami" },
  "2026-08-07": { month: "Shravan", paksha: "Krishna", tithi: "Navami" },
  "2026-08-08": { month: "Shravan", paksha: "Krishna", tithi: "Dashami" },
  "2026-08-09": { month: "Shravan", paksha: "Krishna", tithi: "Ekadashi-Dwadashi" },
  "2026-08-10": { month: "Shravan", paksha: "Krishna", tithi: "Trayodashi" },
  "2026-08-11": { month: "Shravan", paksha: "Krishna", tithi: "Chaturdashi" },
  "2026-08-12": { month: "Shravan", paksha: "Krishna", tithi: "Amavasya" },
  "2026-08-13": { month: "Shravan", paksha: "Shukla", tithi: "Pratipada" },
  "2026-08-14": { month: "Shravan", paksha: "Shukla", tithi: "Dwitiya" },
  "2026-08-15": { month: "Shravan", paksha: "Shukla", tithi: "Tritiya" },
  "2026-08-16": { month: "Shravan", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-08-17": { month: "Shravan", paksha: "Shukla", tithi: "Panchami" },
  "2026-08-18": { month: "Shravan", paksha: "Shukla", tithi: "Shashthi" },
  "2026-08-19": { month: "Shravan", paksha: "Shukla", tithi: "Saptami" },
  "2026-08-20": { month: "Shravan", paksha: "Shukla", tithi: "Ashtami" },
  "2026-08-21": { month: "Shravan", paksha: "Shukla", tithi: "Navami" },
  "2026-08-22": { month: "Shravan", paksha: "Shukla", tithi: "Dashami" },
  "2026-08-23": { month: "Shravan", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-08-24": { month: "Shravan", paksha: "Shukla", tithi: "Dwadashi" },
  "2026-08-25": { month: "Shravan", paksha: "Shukla", tithi: "Trayodashi" },
  "2026-08-26": { month: "Shravan", paksha: "Shukla", tithi: "Chaturdashi" },
  "2026-08-27": { month: "Shravan", paksha: "Shukla", tithi: "Purnima" },
  "2026-08-28": { month: "Bhadrapada", paksha: "Krishna", tithi: "Pratipada" },
  "2026-08-29": { month: "Bhadrapada", paksha: "Krishna", tithi: "Pratipada" },
  "2026-08-30": { month: "Bhadrapada", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-08-31": { month: "Bhadrapada", paksha: "Krishna", tithi: "Tritiya-Chaturthi" },
  "2026-09-01": { month: "Bhadrapada", paksha: "Krishna", tithi: "Panchami" },
  "2026-09-02": { month: "Bhadrapada", paksha: "Krishna", tithi: "Shashthi" },
  "2026-09-03": { month: "Bhadrapada", paksha: "Krishna", tithi: "Saptami" },
  "2026-09-04": { month: "Bhadrapada", paksha: "Krishna", tithi: "Ashtami" },
  "2026-09-05": { month: "Bhadrapada", paksha: "Krishna", tithi: "Navami" },
  "2026-09-06": { month: "Bhadrapada", paksha: "Krishna", tithi: "Dashami" },
  "2026-09-07": { month: "Bhadrapada", paksha: "Krishna", tithi: "Ekadashi" },
  "2026-09-08": { month: "Bhadrapada", paksha: "Krishna", tithi: "Dwadashi" },
  "2026-09-09": { month: "Bhadrapada", paksha: "Krishna", tithi: "Trayodashi" },
  "2026-09-10": { month: "Bhadrapada", paksha: "Krishna", tithi: "Chaturdashi" },
  "2026-09-11": { month: "Bhadrapada", paksha: "Krishna", tithi: "Amavasya" },
  "2026-09-12": { month: "Bhadrapada", paksha: "Shukla", tithi: "Pratipada-Dwitiya" },
  "2026-09-13": { month: "Bhadrapada", paksha: "Shukla", tithi: "Tritiya" },
  "2026-09-14": { month: "Bhadrapada", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-09-15": { month: "Bhadrapada", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-09-16": { month: "Bhadrapada", paksha: "Shukla", tithi: "Panchami" },
  "2026-09-17": { month: "Bhadrapada", paksha: "Shukla", tithi: "Shashthi" },
  "2026-09-18": { month: "Bhadrapada", paksha: "Shukla", tithi: "Saptami" },
  "2026-09-19": { month: "Bhadrapada", paksha: "Shukla", tithi: "Ashtami" },
  "2026-09-20": { month: "Bhadrapada", paksha: "Shukla", tithi: "Navami" },
  "2026-09-21": { month: "Bhadrapada", paksha: "Shukla", tithi: "Dashami" },
  "2026-09-22": { month: "Bhadrapada", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-09-23": { month: "Bhadrapada", paksha: "Shukla", tithi: "Dwadashi" },
  "2026-09-24": { month: "Bhadrapada", paksha: "Shukla", tithi: "Trayodashi" },
  "2026-09-25": { month: "Bhadrapada", paksha: "Shukla", tithi: "Chaturdashi" },
  "2026-09-26": { month: "Bhadrapada", paksha: "Shukla", tithi: "Purnima" },
  "2026-09-27": { month: "Ashwin", paksha: "Krishna", tithi: "Pratipada" },
  "2026-09-28": { month: "Ashwin", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-09-29": { month: "Ashwin", paksha: "Krishna", tithi: "Tritiya" },
  "2026-09-30": { month: "Ashwin", paksha: "Krishna", tithi: "Chaturthi" },
  "2026-10-01": { month: "Ashwin", paksha: "Krishna", tithi: "Panchami" },
  "2026-10-02": { month: "Ashwin", paksha: "Krishna", tithi: "Shashthi" },
  "2026-10-03": { month: "Ashwin", paksha: "Krishna", tithi: "Saptami" },
  "2026-10-04": { month: "Ashwin", paksha: "Krishna", tithi: "Ashtami" },
  "2026-10-05": { month: "Ashwin", paksha: "Krishna", tithi: "Navami" },
  "2026-10-06": { month: "Ashwin", paksha: "Krishna", tithi: "Dashami" },
  "2026-10-07": { month: "Ashwin", paksha: "Krishna", tithi: "Ekadashi" },
  "2026-10-08": { month: "Ashwin", paksha: "Krishna", tithi: "Dwadashi" },
  "2026-10-09": { month: "Ashwin", paksha: "Krishna", tithi: "Trayodashi-Chaturdashi" },
  "2026-10-10": { month: "Ashwin", paksha: "Krishna", tithi: "Amavasya" },
  "2026-10-11": { month: "Ashwin", paksha: "Shukla", tithi: "Pratipada" },
  "2026-10-12": { month: "Ashwin", paksha: "Shukla", tithi: "Dwitiya" },
  "2026-10-13": { month: "Ashwin", paksha: "Shukla", tithi: "Tritiya" },
  "2026-10-14": { month: "Ashwin", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-10-15": { month: "Ashwin", paksha: "Shukla", tithi: "Panchami" },
  "2026-10-16": { month: "Ashwin", paksha: "Shukla", tithi: "Shashthi" },
  "2026-10-17": { month: "Ashwin", paksha: "Shukla", tithi: "Saptami" },
  "2026-10-18": { month: "Ashwin", paksha: "Shukla", tithi: "Ashtami" },
  "2026-10-19": { month: "Ashwin", paksha: "Shukla", tithi: "Navami" },
  "2026-10-20": { month: "Ashwin", paksha: "Shukla", tithi: "Dashami" },
  "2026-10-21": { month: "Ashwin", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-10-22": { month: "Ashwin", paksha: "Shukla", tithi: "Dwadashi" },
  "2026-10-23": { month: "Ashwin", paksha: "Shukla", tithi: "Trayodashi" },
  "2026-10-24": { month: "Ashwin", paksha: "Shukla", tithi: "Chaturdashi" },
  "2026-10-25": { month: "Ashwin", paksha: "Shukla", tithi: "Purnima" },
  "2026-10-26": { month: "Kartik", paksha: "Krishna", tithi: "Pratipada" },
  "2026-10-27": { month: "Kartik", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-10-28": { month: "Kartik", paksha: "Krishna", tithi: "Tritiya" },
  "2026-10-29": { month: "Kartik", paksha: "Krishna", tithi: "Chaturthi" },
  "2026-10-30": { month: "Kartik", paksha: "Krishna", tithi: "Panchami" },
  "2026-10-31": { month: "Kartik", paksha: "Krishna", tithi: "Shashthi" },
  "2026-11-01": { month: "Kartik", paksha: "Krishna", tithi: "Saptami" },
  "2026-11-02": { month: "Kartik", paksha: "Krishna", tithi: "Ashtami" },
  "2026-11-03": { month: "Kartik", paksha: "Krishna", tithi: "Navami" },
  "2026-11-04": { month: "Kartik", paksha: "Krishna", tithi: "Dashami" },
  "2026-11-05": { month: "Kartik", paksha: "Krishna", tithi: "Ekadashi" },
  "2026-11-06": { month: "Kartik", paksha: "Krishna", tithi: "Dwadashi" },
  "2026-11-07": { month: "Kartik", paksha: "Krishna", tithi: "Trayodashi" },
  "2026-11-08": { month: "Kartik", paksha: "Krishna", tithi: "Chaturdashi" },
  "2026-11-09": { month: "Kartik", paksha: "Krishna", tithi: "Amavasya" },
  "2026-11-10": { month: "Kartik", paksha: "Shukla", tithi: "Pratipada" },
  "2026-11-11": { month: "Kartik", paksha: "Shukla", tithi: "Dwitiya" },
  "2026-11-12": { month: "Kartik", paksha: "Shukla", tithi: "Tritiya" },
  "2026-11-13": { month: "Kartik", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-11-14": { month: "Kartik", paksha: "Shukla", tithi: "Panchami" },
  "2026-11-15": { month: "Kartik", paksha: "Shukla", tithi: "Shashthi" },
  "2026-11-16": { month: "Kartik", paksha: "Shukla", tithi: "Saptami" },
  "2026-11-17": { month: "Kartik", paksha: "Shukla", tithi: "Ashtami" },
  "2026-11-18": { month: "Kartik", paksha: "Shukla", tithi: "Navami" },
  "2026-11-19": { month: "Kartik", paksha: "Shukla", tithi: "Dashami" },
  "2026-11-20": { month: "Kartik", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-11-21": { month: "Kartik", paksha: "Shukla", tithi: "Dwadashi" },
  "2026-11-22": { month: "Kartik", paksha: "Shukla", tithi: "Trayodashi" },
  "2026-11-23": { month: "Kartik", paksha: "Shukla", tithi: "Chaturdashi" },
  "2026-11-24": { month: "Kartik", paksha: "Shukla", tithi: "Purnima" },
  "2026-11-25": { month: "Margashirsha", paksha: "Krishna", tithi: "Pratipada" },
  "2026-11-26": { month: "Margashirsha", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-11-27": { month: "Margashirsha", paksha: "Krishna", tithi: "Tritiya" },
  "2026-11-28": { month: "Margashirsha", paksha: "Krishna", tithi: "Chaturthi" },
  "2026-11-29": { month: "Margashirsha", paksha: "Krishna", tithi: "Panchami" },
  "2026-11-30": { month: "Margashirsha", paksha: "Krishna", tithi: "Shashthi" },
  "2026-12-01": { month: "Margashirsha", paksha: "Krishna", tithi: "Saptami" },
  "2026-12-02": { month: "Margashirsha", paksha: "Krishna", tithi: "Ashtami" },
  "2026-12-03": { month: "Margashirsha", paksha: "Krishna", tithi: "Navami" },
  "2026-12-04": { month: "Margashirsha", paksha: "Krishna", tithi: "Dashami" },
  "2026-12-05": { month: "Margashirsha", paksha: "Krishna", tithi: "Ekadashi" },
  "2026-12-06": { month: "Margashirsha", paksha: "Krishna", tithi: "Dwadashi" },
  "2026-12-07": { month: "Margashirsha", paksha: "Krishna", tithi: "Trayodashi" },
  "2026-12-08": { month: "Margashirsha", paksha: "Krishna", tithi: "Chaturdashi" },
  "2026-12-09": { month: "Margashirsha", paksha: "Krishna", tithi: "Amavasya" },
  "2026-12-10": { month: "Margashirsha", paksha: "Shukla", tithi: "Pratipada" },
  "2026-12-11": { month: "Margashirsha", paksha: "Shukla", tithi: "Dwitiya" },
  "2026-12-12": { month: "Margashirsha", paksha: "Shukla", tithi: "Tritiya" },
  "2026-12-13": { month: "Margashirsha", paksha: "Shukla", tithi: "Chaturthi" },
  "2026-12-14": { month: "Margashirsha", paksha: "Shukla", tithi: "Panchami" },
  "2026-12-15": { month: "Margashirsha", paksha: "Shukla", tithi: "Shashthi" },
  "2026-12-16": { month: "Margashirsha", paksha: "Shukla", tithi: "Saptami" },
  "2026-12-17": { month: "Margashirsha", paksha: "Shukla", tithi: "Ashtami" },
  "2026-12-18": { month: "Margashirsha", paksha: "Shukla", tithi: "Navami" },
  "2026-12-19": { month: "Margashirsha", paksha: "Shukla", tithi: "Dashami" },
  "2026-12-20": { month: "Margashirsha", paksha: "Shukla", tithi: "Ekadashi" },
  "2026-12-21": { month: "Margashirsha", paksha: "Shukla", tithi: "Dwadashi" },
  "2026-12-22": { month: "Margashirsha", paksha: "Shukla", tithi: "Trayodashi" },
  "2026-12-23": { month: "Margashirsha", paksha: "Shukla", tithi: "Chaturdashi" },
  "2026-12-24": { month: "Margashirsha", paksha: "Shukla", tithi: "Purnima" },
  "2026-12-25": { month: "Paush", paksha: "Krishna", tithi: "Pratipada" },
  "2026-12-26": { month: "Paush", paksha: "Krishna", tithi: "Dwitiya" },
  "2026-12-27": { month: "Paush", paksha: "Krishna", tithi: "Tritiya" },
  "2026-12-28": { month: "Paush", paksha: "Krishna", tithi: "Chaturthi" },
  "2026-12-29": { month: "Paush", paksha: "Krishna", tithi: "Panchami" },
  "2026-12-30": { month: "Paush", paksha: "Krishna", tithi: "Shashthi" },
  "2026-12-31": { month: "Paush", paksha: "Krishna", tithi: "Saptami" },
};

const kalyanakJson: Record<string, KalyanakData> = {
  "2026-07-01": { tirthankar: null, kalyanak_type: null },
  "2026-07-03": { tirthankar: "Shri Shreyansnath", kalyanak_type: "Moksha Kalyanak" },
  "2026-07-07": { tirthankar: "Shri Anantnath", kalyanak_type: "Garbh Kalyanak" },
  "2026-07-08": { tirthankar: "Shri Naminath", kalyanak_type: "Janma Kalyanak" },
  "2026-07-09": { tirthankar: "Shri Kunthunath", kalyanak_type: "Garbh Kalyanak" },
  "2026-07-19": { tirthankar: "Shri Mahavir Swami", kalyanak_type: "Garbh Kalyanak" },
  "2026-07-21": { tirthankar: "Shri Neminath", kalyanak_type: "Moksha Kalyanak" },
  "2026-07-28": { tirthankar: "Shri Vasupujya Swami", kalyanak_type: "Moksha Kalyanak" },
  "2026-08-05": { tirthankar: "Shri Chandra Prabh Swami, Shri Shantinath", kalyanak_type: "Moksha Kalyanak, Garbh Kalyanak" },
  "2026-08-06": { tirthankar: "Shri Suparshvanath", kalyanak_type: "Garbh Kalyanak" },
  "2026-08-09": { tirthankar: "Shri Muni Suvrat Swami", kalyanak_type: "Keval Gyan Kalyanak" },
  "2026-08-14": { tirthankar: "Shri Sumatinath", kalyanak_type: "Garbh Kalyanak" },
  "2026-08-17": { tirthankar: "Shri Neminath", kalyanak_type: "Janma Kalyanak" },
  "2026-08-18": { tirthankar: "Shri Neminath", kalyanak_type: "Tap Kalyanak" },
  "2026-08-20": { tirthankar: "Shri Parsvanath", kalyanak_type: "Moksha Kalyanak" },
  "2026-08-27": { tirthankar: "Shri Muni Suvrat Swami", kalyanak_type: "Garbh Kalyanak" },
  "2026-09-11": { tirthankar: "Shri Neminath", kalyanak_type: "Keval Gyan Kalyanak" },
  "2026-09-20": { tirthankar: "Shri Suvidhi Nath", kalyanak_type: "Moksha Kalyanak" },
  "2026-10-01": { tirthankar: "Shri Sambhavnath", kalyanak_type: "Keval Gyan Kalyanak" },
  "2026-10-08": { tirthankar: "Shri Padma Prabh Swami, Shri Neminath", kalyanak_type: "Janma Kalyanak, Garbh Kalyanak" },
  "2026-10-09": { tirthankar: "Shri Padma Prabh Swami", kalyanak_type: "Tap Kalyanak" },
  "2026-10-10": { tirthankar: "Shri Mahavir Swami", kalyanak_type: "Moksha Kalyanak" },
  "2026-10-25": { tirthankar: "Shri Naminath", kalyanak_type: "Garbh Kalyanak" },
  "2026-10-30": { tirthankar: "Shri Suvidhi Nath", kalyanak_type: "Janma Kalyanak" },
  "2026-10-31": { tirthankar: "Shri Suvidhi Nath", kalyanak_type: "Tap Kalyanak" },
  "2026-11-04": { tirthankar: "Shri Mahavir Swami", kalyanak_type: "Tap Kalyanak" },
  "2026-11-12": { tirthankar: "Shri Suvidhi Nath", kalyanak_type: "Keval Gyan Kalyanak" },
  "2026-11-21": { tirthankar: "Shri Arnath", kalyanak_type: "Keval Gyan Kalyanak" },
  "2026-12-04": { tirthankar: "Shri Parsvanath", kalyanak_type: "Janma Kalyanak" },
  "2026-12-05": { tirthankar: "Shri Parsvanath", kalyanak_type: "Tap Kalyanak" },
  "2026-12-06": { tirthankar: "Shri Chandra Prabh Swami", kalyanak_type: "Janma Kalyanak" },
  "2026-12-07": { tirthankar: "Shri Chandra Prabh Swami", kalyanak_type: "Tap Kalyanak" },
  "2026-12-08": { tirthankar: "Shri Shitalnath", kalyanak_type: "Keval Gyan Kalyanak" },
  "2026-12-19": { tirthankar: "Shri Arnath", kalyanak_type: "Janma Kalyanak, Moksha Kalyanak" },
  "2026-12-20": { tirthankar: "Shri Arnath, Shri Mallinath, Shri Naminath", kalyanak_type: "Tap Kalyanak, Janma Kalyanak & Tap Kalyanak & Keval Gyan Kalyanak, Keval Gyan Kalyanak" },
  "2026-12-23": { tirthankar: "Shri Sambhavnath", kalyanak_type: "Janma Kalyanak" },
  "2026-12-24": { tirthankar: "Shri Sambhavnath", kalyanak_type: "Tap Kalyanak" },
  "2026-12-30": { tirthankar: "Shri Padma Prabh Swami", kalyanak_type: "Garbh Kalyanak" },
};

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getKalyanakBadgeColor(type: string): string {
  if (type.includes('Moksha')) return 'bg-purple-900/30 border-purple-500/30 text-purple-300';
  if (type.includes('Janma')) return 'bg-green-900/30 border-green-500/30 text-green-300';
  if (type.includes('Keval')) return 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300';
  if (type.includes('Garbh')) return 'bg-blue-900/30 border-blue-500/30 text-blue-300';
  if (type.includes('Tap')) return 'bg-orange-900/30 border-orange-500/30 text-orange-300';
  return 'bg-primary/20 border-primary/30 text-primary';
}

export default function PanchangClient() {
  const [today, setToday] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [sunLoading, setSunLoading] = useState(true);
  const [sunError, setSunError] = useState(false);

  useEffect(() => {
    const now = new Date();
    setToday(formatDateKey(now));
    setDisplayDate(formatDisplayDate(now));

    // Fetch sunrise/sunset
    fetch('https://api.sunrisesunset.io/json?lat=23.1765&lng=75.7885')
      .then((r) => r.json())
      .then((data) => {
        if (data?.results) {
          setSunData({ sunrise: data.results.sunrise, sunset: data.results.sunset });
        } else {
          setSunError(true);
        }
      })
      .catch(() => setSunError(true))
      .finally(() => setSunLoading(false));
  }, []);

  const panchang = today ? panchangJson[today] : null;
  const kalyanak = today ? kalyanakJson[today] : null;
  const hasKalyanak = kalyanak?.tirthankar && kalyanak?.kalyanak_type;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      {/* Page header */}
      <div className="mb-10 text-center">
        <p className="text-motto text-primary mb-3 opacity-70 tracking-[0.3em]"> जय जिनेन्द्र</p>
        <h1 className="text-section-xl text-foreground uppercase">
          Aaj Ka <span className="gold-gradient-text">Panchang</span>
        </h1>
        {displayDate && (
          <p className="mt-3 text-sm font-medium text-muted-foreground">{displayDate}</p>
        )}
      </div>

      {/* Sunrise / Sunset */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="sun-card rounded-2xl p-5 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="SunIcon" size={22} className="text-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sunrise</p>
          {sunLoading ? (
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          ) : sunError ? (
            <p className="text-xs text-muted-foreground">Unavailable</p>
          ) : (
            <p className="text-xl font-black text-foreground">{sunData?.sunrise}</p>
          )}
        </div>
        <div className="sun-card rounded-2xl p-5 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="MoonIcon" size={22} className="text-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sunset</p>
          {sunLoading ? (
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          ) : sunError ? (
            <p className="text-xs text-muted-foreground">Unavailable</p>
          ) : (
            <p className="text-xl font-black text-foreground">{sunData?.sunset}</p>
          )}
        </div>
      </div>

      {/* Panchang card */}
      {panchang ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          <div className="bg-primary/10 border-b border-border px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Jain Panchang</p>
          </div>
          <div className="divide-y divide-border">
            <PanchangRow label="Hindi Maah (Month)" value={panchang.month} />
            <PanchangRow label="Paksha" value={panchang.paksha} paksha={panchang.paksha} />
            <PanchangRow label="Tithi" value={panchang.tithi} />
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
          <p className="text-muted-foreground text-sm font-medium">
            Panchang data not available for today. Please check back later.
          </p>
        </div>
      )}

      {/* Kalyanak — only show if present */}
      {hasKalyanak && (
        <div className="kalyanak-badge rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="StarIcon" size={20} className="text-primary" variant="solid" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80">
                Tirthankar Kalyanak
              </p>
              <p className="text-xs font-medium text-muted-foreground">Tirthankar Kalyanak Today</p>
            </div>
          </div>

          {/* Handle multiple kalyanaks (comma-separated) */}
          {kalyanak!.tirthankar!.split(',').map((tirth, idx) => {
            const types = kalyanak!.kalyanak_type!.split(',');
            const type = types[idx]?.trim() || '';
            return (
              <div key={idx} className={`mb-3 last:mb-0 p-4 rounded-xl border ${getKalyanakBadgeColor(type)}`}>
                <p className="text-sm font-black text-foreground">{tirth.trim()}</p>
                <p className="text-xs font-bold mt-1 opacity-90">{type}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quote */}
      <div className="mt-8 border-t border-border pt-8 text-center">
        <p className="text-sm font-bold text-primary leading-relaxed">
          सम्यग्दर्शनज्ञानचारित्राणिमोक्षमार्ग:
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-widest">
          Right Vision · Right Knowledge · Right Conduct
        </p>
      </div>
    </div>
  );
}

function PanchangRow({
  label,
  value,
  paksha,
}: {
  label: string;
  value: string;
  paksha?: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex-shrink-0">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {paksha && (
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              paksha === 'Shukla' ? 'bg-foreground' : 'bg-muted-foreground'
            }`}
          />
        )}
        <p className="text-sm font-black text-foreground text-right">{value}</p>
      </div>
    </div>
  );
}