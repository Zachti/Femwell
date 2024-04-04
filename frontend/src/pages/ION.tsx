import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Divider,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useBreakpointValue,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { ArticleModel } from "../models/article.model";
import Article from "../components/Article";
import { ReactSortable } from "react-sortablejs";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ION = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedArticle, setSelectedArticle] = useState<ArticleModel>();

  const [articles, setArticles] = useState<ArticleModel[]>([
    { id: "1", title: "Article 1", content: "Content 1", recommended: true },
    { id: "2", title: "Article 2", content: "Content 1", recommended: true },
    { id: "3", title: "Article 3", content: "Content 1", recommended: false },
    { id: "4", title: "Article 4", content: "Content 1", recommended: true },
    { id: "5", title: "Article 5", content: "Content 1", recommended: false },
    { id: "6", title: "Article 6", content: "Content 1", recommended: false },
    { id: "7", title: "Article 7", content: "Content 1", recommended: true },
    { id: "8", title: "Article 8", content: "Content 1", recommended: true },
  ]);

  const [laterArticles, setLaterArticles] = useState<ArticleModel[]>([
    { id: "69", title: "Nignog", content: "Content 1", recommended: true },
  ]);

  const openArticle = (article: any) => {
    setSelectedArticle(article);
    onOpen();
  };

  const onEnd = (evt: any) => {
    const { oldIndex, newIndex, to, from } = evt;
    const sourceListName = from.id;
    const destinationListName = to.id;

    if (sourceListName === destinationListName) {
      const list =
        sourceListName === "articles"
          ? Array.from(articles)
          : Array.from(laterArticles);
      const [removed] = list.splice(oldIndex, 1);
      list.splice(newIndex, 0, removed);
      sourceListName === "articles"
        ? setArticles(list)
        : setLaterArticles(list);
    } else {
      const sourceList =
        sourceListName === "articles"
          ? Array.from(articles)
          : Array.from(laterArticles);
      const destinationList =
        destinationListName === "articles"
          ? Array.from(articles)
          : Array.from(laterArticles);
      const [removed] = sourceList.splice(oldIndex, 1);
      destinationList.splice(newIndex, 0, removed);
      sourceListName === "articles"
        ? setArticles(sourceList)
        : setLaterArticles(sourceList);
      destinationListName === "articles"
        ? setArticles(destinationList)
        : setLaterArticles(destinationList);
    }
  };

  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    md: "1fr 1fr",
    lg: "1fr 1fr 1fr",
  });

  const [isLargerThan1400] = useMediaQuery("(min-width: 1400px)");
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

  return (
    <div className="page">
      <Header image="/sunset.jpg">
        <h1>Informational Online Notebook</h1>
      </Header>

      <VStack>
        {/* article container */}
        <VStack spacing="5" width="100%" justifyContent={"center"}>
          <VStack
            width="auto"
            spacing="5"
            paddingTop="5"
            borderRadius="md"
            borderColor="var(--secondrary-color)"
          >
            <Heading as="h2" size="lg">
              Articles
            </Heading>
            <Divider />
            <Box
              display="grid"
              width={"100%"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <ReactSortable
                id="articles"
                list={articles}
                setList={setArticles}
                handle=".drag-handle"
                animation={500}
                group="articles"
                onChange={(order, sortable, evt) => {}}
                onEnd={onEnd}
                forceFallback={true}
                scroll={true}
                scrollSpeed={isLargerThan1400 ? 10 : isLargerThan900 ? 20 : 30}
                style={{
                  display: "grid",
                  gridTemplateColumns: gridTemplateColumns,
                  width: "100%",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {articles.map((article) => (
                  <Article
                    key={article.id}
                    image="/sunset.jpg"
                    title={article.title}
                    summary="To take full responsibility for your uterus and fertility, you must know the risks involved in the abortion process, know what the warning signs are..."
                    onClick={() => openArticle(article)}
                    isRecommended={article.recommended}
                  />
                ))}
              </ReactSortable>
            </Box>
          </VStack>

          {/* read later container */}
          <VStack
            width="auto"
            spacing="5"
            paddingTop="5"
            borderRadius="md"
            borderColor="var(--secondrary-color)"
          >
            <Heading as="h2" size="lg">
              Read Later
            </Heading>
            <Divider />
            <Box
              display="grid"
              width={"100%"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <ReactSortable
                id="readLater"
                list={laterArticles}
                setList={setLaterArticles}
                group="articles"
                handle=".drag-handle"
                animation={150}
                onChange={(order, sortable, evt) => {}}
                onEnd={onEnd}
                forceFallback={true}
                scroll={true}
                scrollSpeed={isLargerThan1400 ? 10 : isLargerThan900 ? 20 : 30}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    laterArticles.length > 0 ? gridTemplateColumns : "1fr",
                  width: "100%",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  minHeight: "200px",
                }}
              >
                {laterArticles.length > 0 ? (
                  laterArticles.map((article) => (
                    <Article
                      key={article.id}
                      image="/sunset.jpg"
                      title={article.title}
                      summary="what are you looking at?"
                      onClick={() => openArticle(article)}
                      isRecommended={article.recommended}
                    />
                  ))
                ) : (
                  <Text
                    fontStyle={"italic"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    *Drag articles here
                  </Text>
                )}
              </ReactSortable>
            </Box>
          </VStack>
        </VStack>
      </VStack>

      <Modal preserveScrollBarGap isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedArticle?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>{selectedArticle?.content}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ION;
