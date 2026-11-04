# TBScanner

Appli web pour téléphone qui lit les **codes de suivi** des Travel Bugs et géocoins (geocaching) avec la
caméra ou depuis des photos, et les range dans une liste à exporter, pour les loguer ensuite sur
geocaching.com.

👉 **https://carreth44.github.io/TBScanner/**

## Installation (Android, Chrome)

1. Ouvrir le lien ci-dessus dans Chrome, de préférence en Wi-Fi : le moteur de lecture (~30 Mo) est
   téléchargé à la première ouverture.
2. Menu ⋮ → **Installer l'application**.
3. Ensuite, l'appli fonctionne **sans réseau**. Quand une nouvelle version est publiée, un bandeau
   « Mettre à jour » apparaît.

## Utilisation

- **Caméra** : placer le code dans le cadre, à ~20 cm, et zoomer avec le curseur de droite si besoin.
  Toucher l'image fait le point ; 🔄 change d'objectif si l'image reste floue.
- **🖼️ Photos** : choisir des photos de la galerie, elles sont lues une à une.
- **🔍 Découvrir** : TB vu et laissé sur place.
- **🎒 Récupérer** : TB emporté, il va dans « Mon sac ». Quand on relit un TB du sac, le bouton devient
  **Déposer**. Pour la récupération et le dépôt, on peut coller le lien de la cache (facultatif) ; la position
  GPS est notée en secours.
- **📋 Liste** : codes groupés par jour, export `.txt` (partager, télécharger ou copier).

## Vie privée

Tout reste sur le téléphone : les photos sont lues localement et les codes ne sont enregistrés que dans
l'appli. Rien n'est envoyé sur un serveur. Rien n'est logué automatiquement sur geocaching.com.

## Crédits

- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) (modèles PP-OCRv4) — Apache 2.0
- [ONNX Runtime Web](https://github.com/microsoft/onnxruntime) — MIT
- Modèles ONNX : [@gutenye/ocr-models](https://www.npmjs.com/package/@gutenye/ocr-models) — MIT
- Fichiers servis par [jsDelivr](https://www.jsdelivr.com/)

Geocaching®, Travel Bug® et Trackable sont des marques de Groundspeak, Inc. TBScanner est une appli
personnelle non officielle, sans lien avec Groundspeak.
